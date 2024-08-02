import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { baseAPI } from "../../config";

const Interview = () => {
  const totalQuestions = 10;
  const navigate = useNavigate();
  const location = useLocation();
  const { stackids, apiKey } = location.state || {};
  const [questions, setQuestions] = useState([]);
  const videoRef = useRef(null);
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [wait, setWait] = useState(false);

  const getUserCamera = () => {
    navigator.mediaDevices.getUserMedia({
      video: true,
    })
      .then((stream) => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      })
      .catch((error) => {
        console.error('Failed to access camera:', error);
      });
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }
  };


  const startRecording = () => {
    if (recorder && recorder.state === 'inactive') {
      recorder.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
      setRecording(false);
    }
  };

  const fetchQuestions = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      stackids.forEach(id => params.append('stack_id', id));
      params.append('size', totalQuestions.toString());

      const response = await baseAPI.get(`/api/questions?${params.toString()}`);
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  }, [stackids]);

  const askQuestion = async (memberAnswer) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `당신은 개발자 면접관이며, 다음 질문에 대해 면접자가 제대로 답변했는지 체크해야합니다.\n
            입력형식은 다음과 같습니다.\n
            면접 질문:  {질문 텍스트}\n
            면접 답변:  {답변 텍스트}\n해당 면접 질문에 대해 면접 답변이 정답인지, 틀렸다면 어느 부분이 틀렸는지 답변해주세요. 코드는 출력하지 않습니다.\n
            그리고 어느 부분이 틀린지 지적해주세요.\n
             면접질문: ${questions[currentQuestion].question} 면접답변: ${memberAnswer}`
          }],
        })
      });

      if (!response.ok) {
        const errorDetail = await response.json();
        throw new Error(`Error in AI response: ${response.statusText}, ${JSON.stringify(errorDetail)}`);
      }

      const result = await response.json();
      return result.choices[0].message.content;

    } catch (error) {
      console.error('Error generating question or getting response from AI:', error);
    }
  };

  const transcribeAudio = async () => {
    if (!audioBlob) {
      alert('Please select an audio file first.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'whisper-1');

      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });

      if (!transcriptionResponse.ok) {
        const errorDetail = await transcriptionResponse.json();
        throw new Error(`Error transcribing audio: ${transcriptionResponse.statusText}, ${JSON.stringify(errorDetail)}`);
      }

      const result = await transcriptionResponse.json();
      return result.text;

    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  const getGptAnswer = async () => {
    // 오디오를 텍스트로 변환
    const memberAnswer = await transcribeAudio();

    // GPT에게 답변 평가 요청
    const gptAnswer = await askQuestion(memberAnswer);

    // 새로운 답변 저장
    const newAnswer = {
      question: questions[currentQuestion].question,
      memberAnswer: memberAnswer,
      gptAnswer: gptAnswer
    };

    // 기존의 답변 리스트에 새 답변 추가
    setAnswers(prevAnswers => [...prevAnswers, newAnswer]);

    // 다음 질문으로 이동
    setCurrentQuestion(prevQuestion => prevQuestion + 1);

    // 다음 질문에 대한 녹음 시작
    startRecording();
    setWait(false);
  }

  const handleNext = async () => {
    // 마지막 질문인 경우 결과 페이지로 이동


    try {
      // 녹음을 멈추고 완전히 처리되기를 기다림
      stopRecording();
    } catch (error) {
      console.error('다음 질문 처리 중 오류 발생:', error);
    }

    if (currentQuestion > totalQuestions - 1) {
      alert("모든 문제가 종료되었습니다. \n면접 결과 화면으로 이동합니다.");
      navigate('/interview/result');
      return;
    }
  };

  const handleSkip = async () => {
    const gptAnswer = await askQuestion("모르겠습니다.");
    const newAnswer = {
      question: questions[currentQuestion].question,
      memberAnswer: "모르겠습니다.",
      gptAnswer: gptAnswer
    };

    setAnswers([...answers, newAnswer]);
    setCurrentQuestion(currentQuestion + 1);
    if (currentQuestion > totalQuestions - 1) {
      alert("모든 문제가 종료되었습니다. \n면접 결과 화면으로 이동합니다.");
      navigate('/interview/result');
      return;
    }
  };


  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    getUserCamera();

    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    async function getMicrophoneAccess() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let audioChunks = [];

      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      });

      mediaRecorder.addEventListener('stop', () => {
        const blob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);
        setAudioURL(audioUrl);
        setAudioBlob(blob);
        audioChunks = [];
        setWait(true);
      });

      setRecorder(mediaRecorder);
      mediaRecorder.start();
      setRecording(true);
    }

    getMicrophoneAccess(); // Start recording after setting the recorder
    return () => {
      // Cleanup recorder
      if (recorder) {
        recorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (wait == true) {
      getGptAnswer();
    }
  }, [wait]);

  return (
    <div>
      <Header />
      <h2>실전 면접</h2>
      {stackids.map(id => (
        <h2 key={id}> Stack ID: {id}</h2>
      ))}
      <h2>apiKey : {apiKey}</h2>
      <video
        className='container'
        ref={videoRef}
        style={{
          transform: 'scaleX(-1)',
          width: '65%',
          height: 'auto',
          borderRadius: '25px',
        }}
      />

      {answers.length > 0 && answers.map((a, index) => (
        <div key={index}>
          <div>Question: {a.question}</div>
          <div>Member Answer: {a.memberAnswer}</div>
          <div>GPT Answer: {a.gptAnswer}</div>
        </div>
      ))}

      {questions.length > 0 &&
        <h1>Q{currentQuestion + 1}. {questions[currentQuestion].question}</h1>}
      <button onClick={handleNext}>Next</button>
      <button onClick={handleSkip}>Skip</button>
      <div>{recording ? '됨' : '멈춤'}</div>
      {/*<button onClick={() => navigate('/interview/result')}>면접 결과</button>*/}
    </div>
  );
};

export default Interview;

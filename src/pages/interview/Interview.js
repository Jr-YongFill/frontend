import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import MyBtn from '../../components/CustomButton';
import { baseAPI } from "../../config";
import Timer from "../../components/Timer";
import pallete from "../../styles/pallete";
import styled from "styled-components";
import palette from "../../styles/pallete";
import {localStorageGetValue} from "../../utils/CryptoUtils";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 20px 0;
  gap: 50px;
`;

const GridContainer = styled.div`
    margin-top: 20px;
    display: flex;
    grid-column: 1 / -1; /* 변경: 그리드의 모든 열을 차지하도록 설정 */
    justify-content: center;
    gap: 5rem;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
`;
const TimerWaitInfo = styled.div`
    background:${palette.gray};
    color: white;
    font-size: 3rem;
    width:20vw;
    text-align:center;
    padding-bottom:2vw;
    border-radius:20px;
    min-width: 300px;
`

const Interview = () => {
  const memberId = localStorageGetValue('member-id');
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
  const [isSkip, setIsSkip] = useState(false);

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

    let memberAnswer, gptAnswer;

    if(isSkip) {
      memberAnswer = "모르겠습니다.";

      gptAnswer = await askQuestion(memberAnswer);
    } else {
      // 오디오를 텍스트로 변환
      memberAnswer = await transcribeAudio();

      // GPT에게 답변 평가 요청
      gptAnswer = await askQuestion(memberAnswer);
    }


    // 새로운 답변 저장
    const newAnswer = {
      questionId: questions[currentQuestion].questionId,
      question: questions[currentQuestion].question,
      memberAnswer: memberAnswer,
      gptAnswer: gptAnswer
    };

    // 기존의 답변 리스트에 새 답변 추가
    setAnswers(prevAnswers => [...prevAnswers, newAnswer]);




    // 다음 질문에 대한 녹음 시작
    startRecording();
    setWait(false);
  }

  useEffect(() => {
    console.log("effect");
    (currentQuestion >= totalQuestions - 1) && handleSubmit();
    setCurrentQuestion(answers.length);
    console.log("current" + currentQuestion);
  }, [answers]);



  const handleNext = async () => {

    setIsSkip(false);

    try {
      // 녹음을 멈추고 완전히 처리되기를 기다림
      await stopRecording();
    } catch (error) {
      console.error('다음 질문 처리 중 오류 발생:', error);
    }

  };

  const handleSkip = async () => {

    setIsSkip(true);

    try {
      // 녹음을 멈추고 완전히 처리되기를 기다림
      await stopRecording();
    } catch (error) {
      console.error('다음 질문 처리 중 오류 발생:', error);
    }

  };

  const handleSubmit = async () => {

    const url = `/api/members/${memberId}/answers`;
    const data = answers.map(item => ({
      questionId: item.questionId,
      memberAnswer: item.memberAnswer,
      gptAnswer: item.gptAnswer,
      interviewMode: "REAL"
    }));

    try {
      const response = await baseAPI.post(url, data);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error posting data:', error);
    }

    alert("모든 문제가 종료되었습니다. \n면접 결과 화면으로 이동합니다.");
    navigate('/interview/result', {
      state: answers.map(item => ({
        question: item.question,
        memberAnswer: item.memberAnswer,
        gptAnswer: item.gptAnswer
      }))
    });
  }


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
      {/*<h2>실전 면접</h2>*/}
      {/*{stackids.map(id => (*/}
      {/*  <h2 key={id}> Stack ID: {id}</h2>*/}
      {/*))}*/}
      {/*<h2>apiKey : {apiKey}</h2>*/}

      {questions[currentQuestion] &&
        <h1>Q{currentQuestion + 1}. {questions[currentQuestion].question}</h1>}

      <GridContainer>
      <video
        className='container'
        ref={videoRef}
        style={{
          transform: 'scaleX(-1)',
          width: 'auto',
          height: '45%',
          borderRadius: '25px',
        }}
      />
      </GridContainer>

      {answers.length > 0 && answers.map((a, index) => (
        <div key={index}>
          <div>Question: {a.question}</div>
          <div>Member Answer: {a.memberAnswer}</div>
          <div>GPT Answer: {a.gptAnswer}</div>
        </div>
      ))}


      <GridContainer>
      {/*<button onClick={() => navigate('/interview/result')}>면접 결과</button>*/}

        {recording ? <Timer handleNext= {handleNext} /> : <TimerWaitInfo>문제를 준비하고 있습니다.</TimerWaitInfo>}

        <ButtonContainer>
          <MyBtn color={pallete.skyblue} onClick={handleNext}>Next</MyBtn>
          <MyBtn color={pallete.skyblue} onClick={handleSkip}>Skip</MyBtn>
        </ButtonContainer>
      </GridContainer>
    </div>
  );
};

export default Interview;

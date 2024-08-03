import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { baseAPI } from '../../config';
import MyBtn from '../../components/CustomButton';
import pallete from '../../styles/pallete';
import styled from 'styled-components';
import Modal from 'react-modal';
import {localStorageGetValue} from "../../utils/CryptoUtils";

const GridContainer = styled.div`
    display: grid;
    grid-template-rows: auto auto 1fr;
    grid-template-columns: 6fr 4fr;
    height: 100vh;
    box-sizing: border-box;
`;

const HeaderContainer = styled.div`
    display: flex;
    grid-column: 1 / -1; /* 변경: 그리드의 모든 열을 차지하도록 설정 */
    justify-content: center;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
`;

const QuestionContainer = styled.div`
    grid-column: 1;
    display: flex;
    justify-content: left;
    margin-left: 30px;
    align-items: center;
`;

const LeftContainer = styled.div`
    grid-column: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const RightContainer = styled.div`
    grid-column: 2;
    display: flex;
    flex-direction: column;
    //justify-content: center;
    //align-items: center;
    margin-top: 100px;
    padding-right: 6rem;
`;

const VideoContainer = styled.div`
    margin-bottom: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px 0;
  gap: 50px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalTextBox = styled.div`
  color: ${(props) => props.color};
  margin-top: 30px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
`;

const IconButton = styled.button`
  border-radius: 50%;
  border: 2px black solid;
  width: 50px;
  height: 50px;
`;

const AnswerContainer = styled.div`
  background-color: lightgray;
  border-radius: 20px;
  border: 20px solid lightgray;
  margin-bottom: 2.5rem;
`;

const PracticeInterview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const memberId = localStorageGetValue('member-id');
  const { stackids, apiKey } = location.state || {};
  const [questionId, setQuestionId] = useState(0);
  const [question, setQuestion] = useState("");
  const [questionAnswers, setQuestionAnswers] = useState(
    localStorage.getItem('answers') ?
    JSON.parse(localStorage.getItem('answers')) :
      []
  );


  const videoRef = useRef(null);
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);


  const [modalSwitch, setModalSwitch] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageNext = () => {
    (currentPage < localStorage.getItem("answersCount") - 1) && setCurrentPage(currentPage + 1)
  }

  const handlePagePrev = () => {
    (currentPage > 0) && setCurrentPage(currentPage - 1)
  }

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

  useEffect(() => {
    getUserCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const fetchQuestion = useCallback(async () => {
    if (!stackids || stackids.length === 0) {
      console.warn('No stack IDs provided.');
      return;
    }

    try {
      const params = new URLSearchParams();
      stackids.forEach((id) => params.append('stack_id', id));
      params.append('size', '1');

      const response = await baseAPI.get(`/api/questions?${params.toString()}`);
      setQuestion(response.data[0].question);
      setQuestionId(response.data[0].questionId);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  }, [stackids]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleNavigate = (path) => {
    stopCamera();
    localStorage.removeItem("answers");
    localStorage.removeItem("answersCount");
    navigate(path);
  };

  const insertAnswer = async (memberAnswer, gptAnswer) => {
    const url = `/api/members/${memberId}/answers`;
    const data = [{
      questionId: questionId,
      memberAnswer: memberAnswer,
      gptAnswer: gptAnswer,
      interviewMode: "PRACTICE"
    }];

    try {
      const response = await baseAPI.post(url, data);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const handleGrade = async () => {
    try {
      const memberAnswer = await transcribeAudio();
      const gptAnswer = await askQuestion(memberAnswer);

      const newAnswer = {
        questionId: questionId,
        question: question,
        memberAnswer: memberAnswer,
        gptAnswer: gptAnswer
      };

      setQuestionAnswers(prevAnswers => {
        const updatedAnswers = [...prevAnswers, newAnswer];


        localStorage.setItem("answers", JSON.stringify(updatedAnswers));
        const newCount = updatedAnswers.length;


        localStorage.setItem("answersCount", newCount.toString());
        setCurrentPage(newCount - 1);
        return updatedAnswers;
      });

      await insertAnswer(memberAnswer, gptAnswer);



    } catch (error) {
      console.error('Error in grading:', error);
    }
  };

  const downloadRecording = () => {
    const url = window.URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '녹음 파일';
    a.click();

    window.URL.revokeObjectURL(url);
  };

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
             면접질문: ${question} 면접답변: ${memberAnswer}`
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
      });

      setRecorder(mediaRecorder);
    }

    getMicrophoneAccess();
  }, []);

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


  return (
    <div>
      <Header />
      <GridContainer>
        <HeaderContainer>

        </HeaderContainer>

        <QuestionContainer>
          <h1 style={{ color: pallete.blue }}>Q. {question}</h1>
        </QuestionContainer>

        <LeftContainer>
          <VideoContainer>
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
          </VideoContainer>
          <ButtonContainer>
            <IconButton onClick={startRecording} disabled={recording}>Start Recording</IconButton>
            <IconButton onClick={stopRecording} disabled={!recording}>Stop Recording</IconButton>
            {audioURL ?
              <audio src={audioURL} controls />
              :
              <div style={{ width: '300px', height: '54px' }}></div>}
            {audioBlob ?
            <IconButton onClick={downloadRecording}>Download</IconButton>
              :
              <div style={{width: '50px'}}> </div>}
          </ButtonContainer>
          <ButtonContainer>
            <MyBtn color={pallete.skyblue} onClick={() => setModalSwitch(true)}>채점하기</MyBtn>
            <MyBtn color={pallete.skyblue} onClick={() => handleNavigate('/interview/note')}>Stop</MyBtn>
            <MyBtn color={pallete.skyblue} onClick={() => fetchQuestion()}>Next</MyBtn>
          </ButtonContainer>
        </LeftContainer>

        {questionAnswers[currentPage] ?
          <RightContainer>

            <h1>답변 내역</h1>
              <>
                <h2 style = {{color: pallete.blue}}>Q. {questionAnswers[currentPage].question}</h2>
                <h3>나의 답변</h3>
                <AnswerContainer><div>{questionAnswers[currentPage].memberAnswer}</div></AnswerContainer>
                <hr/>
                <h3>GPT의 답변</h3>
                <AnswerContainer><div>{questionAnswers[currentPage].gptAnswer}</div></AnswerContainer>
              </>

            <ButtonContainer style={{width: '200px', alignContent: "center"}}>
              <IconButton onClick={handlePagePrev}>Prev</IconButton>
              {currentPage + 1}/{localStorage.getItem("answersCount")}
              <IconButton onClick={handlePageNext}>Next</IconButton>
            </ButtonContainer>
          </RightContainer>
        :
          <h2 style={{height: '100%', justifyContent: 'center'}}>채점을 진행하면 답변 내역이 표시됩니다.</h2>
        }


        <div style={{gridColumn: '1 / span 2', textAlign: 'center'}}>


        </div>

        <Modal
          isOpen={modalSwitch}
          onRequestClose={() => setModalSwitch(false)}
          style={{
            content: {
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '500px',
              borderRadius: '30px',
              border: 'none',
              background: `${pallete.pink}`,
            }
          }}
        >
          <ModalContent>
            <ModalTextBox color={'red'}>
              <h2>요금이 부과될 수 있습니다.</h2>
            </ModalTextBox>
            <ModalTextBox style={{ marginBottom: '5rem' }}>
              채점을 진행하면 GPT API를 사용합니다.
            </ModalTextBox>
            <MyBtn
              color={pallete.skyblue}
              onClick={ async () => {
                await handleGrade();
                setModalSwitch(false);
              }}
            >
              채점하기
            </MyBtn>
          </ModalContent>
        </Modal>
      </GridContainer>
    </div>
  );
};

export default PracticeInterview;

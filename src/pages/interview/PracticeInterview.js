import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { baseAPI } from '../../config';
import styled from 'styled-components';
import { localStorageGetValue } from "../../utils/CryptoUtils";
import Wrapper from '../../components/Wrapper';
import GlassCard from '../../components/GlassCard';
import CustomButton from '../../components/CustomButton';
import GlassModalChildren from '../../components/modal/GlassModalChildren';
import GlassModal from '../../components/modal/GlassModal';
import Block from '../../components/Block';

const QuestionContainer = styled.div`
    grid-column: 1;
    display: flex;
    justify-content: left;
    margin-left: 30px;
    align-items: center;
    flex-direction: column;

`;


const VideoContainer = styled.div`
    flex : 6;
    margin-bottom: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
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
  const [btnBlock, setBtnBlock] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalOnClick, setModalOnClick] = useState(null);

  const [submitted, setSubmitted] = useState(true);


  const [hasCameraAccess, setHasCameraAccess] = useState(false);

  const handlePageNext = () => {
    (currentPage < localStorage.getItem("answersCount") - 1) && setCurrentPage(currentPage + 1)
  }

  const handlePagePrev = () => {
    (currentPage > 0) && setCurrentPage(currentPage - 1)
  }
  const getUserCamera = () => {
    setHasCameraAccess(true);
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
        console.error(`getUserCamera : ${error}`);
        setHasCameraAccess(false);
        setModalText(`카메라를 인식할 수 없습니다.\n기본 이미지로 대체합니다.`); // HTTP 요청이 아닌 경우, error.response가 없을 수 있음
        setModalOnClick(() => () => {
          setIsModalOpen(false);
        });
        setIsModalOpen(true);
      });
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      setHasCameraAccess(false);
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
      setModalText(error.response.data.message);
      setModalOnClick(() => () => {
        setIsModalOpen(false);
      })
      setIsModalOpen(true);
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
    } catch (error) {
      setModalText(error.response.data.message);
      setModalOnClick(() => () => {
        setIsModalOpen(false);
      })
      setIsModalOpen(true);
    }
  };

  const handleGrade = async () => {
    try {
      setBtnBlock(true);
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

      setBtnBlock(false);
    } catch (error) {
      setModalText(error.response.data.message);
      setModalOnClick(() => () => {
        setIsModalOpen(false);
      })
      setIsModalOpen(true);
    }
  };

  const downloadRecording = () => {
    const url = window.URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${question}_${new Date()}`;
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
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `당신은 개발자 면접관이며, 다음 질문에 대해 면접자가 제대로 답변했는지 체크해야합니다.\n
            다음 면접 질문과 답변에 대해 면접 답변이 정답인지, 틀렸다면 어느 부분이 틀렸는지 답변해주세요. 코드는 출력하지 않습니다.\n
            그리고 어느 부분이 틀린지 지적해주세요.\n
             면접질문: ${question}, 면접답변: ${memberAnswer}`
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
      throw error;
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
      throw error;
    }
  };


  useEffect(() => {
    async function getMicrophoneAccess() {
      try {
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
      } catch (error) {
        console.error(`mediaRecorder : ${error}`);
        setModalText(`마이크를 인식할 수 없습니다.면접을 진행할 수 없습니다.`); // HTTP 요청이 아닌 경우, error.response가 없을 수 있음
        setModalOnClick(() => () => {
          setIsModalOpen(false);
          navigate('/interview/practice-choice-stack');
        });
        setIsModalOpen(true);
      }
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

  const addCredit = async (credit) => {
    const url = `/api/members/${memberId}/credit`;
    const data = {
      credit: credit
    };

    try {
      const response = await baseAPI.patch(url, data);
    } catch (error) {
      setModalText(error.response.data.message);
      setModalOnClick(() => () => {
        setIsModalOpen(false);
      })
      setIsModalOpen(true);
    }
  };


  return (
    <>
      <Header />
      <Wrapper>
        <div style={{ display: 'block ', flexDirection: 'column' }}><Block />
          <div style={{ display: 'flex', justifyContent: 'space-around'}}>
            <GlassCard width={"40vw"} margin={"1vw"}>
              <QuestionContainer>
                <h1 style={{ wordBreak: 'keep-all' }}>Q. {question}</h1>
                {recording && <h4 style={{color: 'red'}}>● Recording</h4>}
              </QuestionContainer>

              <VideoContainer>
                {hasCameraAccess ?
                  <video
                    className='container'
                    ref={videoRef}
                    style={{
                      transform: 'scaleX(-1)',
                      width: '65%',
                      height: 'auto',
                      borderRadius: '25px',
                    }}
                  /> :
                  <div
                    style={{
                      width: '20rem',
                      height: '12rem',
                      borderRadius: '25px',
                      backgroundColor: 'black',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}
                  >
                    카메라를 사용할 수 없습니다.
                  </div>
                }

              </VideoContainer>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-around'}}>
                  <CustomButton
                    isNotHover={recording}
                    onClick={() => {
                      setSubmitted(false);
                      startRecording();}}
                    disabled={recording}>답변 시작</CustomButton>
                  <CustomButton
                    isNotHover={!recording}
                    onClick={stopRecording}
                    disabled={!recording}>답변 종료</CustomButton>
                  {audioBlob &&
                    <CustomButton onClick={downloadRecording}>Download</CustomButton>
                  }
                </div>
                {audioURL &&
                  <audio
                    style={{ width: '80%', marginTop: '30px', }}
                    src={audioURL} controls />
                }
                <div style={{ marginTop: '30px', width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                  <CustomButton
                    isNotHover={submitted || recording}
                    disabled={submitted || recording}
                    onClick={() => setModalSwitch(true)}>답변 제출</CustomButton>
                  <CustomButton
                    isNotHover={recording}
                    disabled={recording}
                    onClick={() => {
                      stopRecording();
                      fetchQuestion();
                      setAudioBlob(null);
                      setAudioURL(null);
                      setSubmitted(true);
                    }}
                  >다음 질문</CustomButton>
                </div>
              </div>
            </GlassCard>
            <GlassCard width={"40vw"} margin={"1vw"}>
              {questionAnswers[currentPage] ?
                <div style={{margin: "2vw"}}>
                  <h1>답변 내역</h1>
                  <>
                    <h2>Q. {questionAnswers[currentPage].question}</h2>
                    <br/>
                    <h3>나의 답변</h3>
                    <GlassCard>{questionAnswers[currentPage].memberAnswer}</GlassCard>
                    <br/>
                    <h3>GPT의 답변</h3>
                    <GlassCard>{questionAnswers[currentPage].gptAnswer}</GlassCard>
                  </>

                  <div style={{ marginTop: '30px', width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                    <CustomButton onClick={handlePagePrev}>Prev</CustomButton>
                    {currentPage + 1}/{localStorage.getItem("answersCount")}
                    <CustomButton onClick={handlePageNext}>Next</CustomButton>
                  </div>
                </div>
                :
                <h2 style={{ height: '100%', justifyContent: 'center' }}>채점을 진행하면 답변 내역이 표시됩니다.</h2>
              }


              <div style={{ gridColumn: '1 / span 2', textAlign: 'center' }}>

              </div>
            </GlassCard>
          </div >
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <CustomButton onClick={() => handleNavigate('/interview/note')}>면접 종료</CustomButton>
          </div>
        </div>
      </Wrapper >

      <GlassModalChildren
        isModalOpen={modalSwitch}
        setIsModalOpen={() => setModalSwitch(false)}>
        <ModalContent>
          <ModalTextBox color={'red'}>
            <h2>요금이 부과될 수 있습니다.</h2>
          </ModalTextBox>
          <ModalTextBox style={{ marginBottom: '5rem' }}>
            채점을 진행하면 GPT API를 사용합니다.
          </ModalTextBox>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
            <CustomButton
              onClick={async () => {
                setSubmitted(true);
                await handleGrade();
                setModalSwitch(false);
                await addCredit(2);
              }}
              isNotHover={btnBlock}
              disabled={btnBlock}
            >
              채점하기
            </CustomButton>
            <CustomButton
              onClick={async () => {
                setModalSwitch(false);
              }}
              isNotHover={submitted}
              disabled={submitted}
            >
              닫기
            </CustomButton>
          </div>
        </ModalContent>
      </GlassModalChildren>

      <GlassModal
        isModalOpen={isModalOpen}
        setIsModalOpen={() => setIsModalOpen(false)}
        message={modalText}
        onClick={modalOnClick} />
    </>
  );
};

export default PracticeInterview;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { baseAPI } from '../config';
import palette from '../styles/pallete';
import Modal from 'react-modal';
import img from '../assets/default.png';
import Header from '../components/Header';
import Wrapper from "../components/Wrapper";
import GlassCard from "../components/GlassCard";
import { RemoveModal } from '../components/modal/RemoveModal';
import { localStorageGetValue } from '../utils/CryptoUtils';
import GlassModal from '../components/modal/GlassModal';
import PageButtonController from '../components/PageButtonController';
import GlassModalChildren from "../components/modal/GlassModalChildren";
import CustomButton from '../components/CustomButton';

const Title = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 30px 50px;
`;

const TitleTextGroup = styled.div``;

const Main = styled.div`
  display: flex;
  margin: 0px 50px;
  flex-direction: column;
`;

const MainHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const MainBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const VoteInfoBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
 	align-items: center;
  padding: 20px;
`;

const ModalStackBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

const Vote = () => {
  const navigate = useNavigate();
  const memberRole = localStorageGetValue('member-role');
  const [voteInfos, setVoteInfos] = useState(null);
  const [stackInfos, setStackInfos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState(0);
  const [isInsertStackModalOpen, setIsInsertStackModalOpen] = useState(false);
  const [insertStackQuestion, setInsertStackQuestion] = useState(null);
  const [selectedStack, setSelectedStack] = useState(null); // Add state to track selected stack

  const [isGlassModalOpen, setIsGlassModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalOnClick, setModalOnClick] = useState(null);

  const fetchInsertStackQuestion = async (questionId) => {
    if (!selectedStack) {
      setIsInsertStackModalOpen(false);
      return;
    }
    try {
      await baseAPI.patch(`/api/admin/questions/${questionId}`, {
        stackId: selectedStack
      });
      setIsInsertStackModalOpen(false);
      window.location.reload();
    } catch (error) {
      setModalText(error.response.data.message);
      setModalOnClick(() => () => {
        setIsGlassModalOpen(false);
      })
      setIsGlassModalOpen(true);
    }
  }

  const getRatio = (vote, stack) => {
    let sum = 0;
    let stackVoteCount = 0;
    for (let i = 0; i < vote.length; i++) {
      sum += vote[i].voteCount;
      if (vote[i].stackId === stack.stackId) {
        stackVoteCount = vote[i].voteCount;
      }
    }

    return sum === 0 ? 0 : Math.round((stackVoteCount / sum) * 100);
  };

  const fetchCreateQuestion = async () => {
    try {
      await baseAPI.post('/api/questions', {
        question: newQuestion,
      });
      await fetchVoteInfos(currentPage);
      setNewQuestion('');
      setIsModalOpen(false);
    } catch (error) {
      setModalText(error.response.data.message);
      setModalOnClick(() => () => {
        setIsGlassModalOpen(false);
      })
      setIsGlassModalOpen(true);
      setNewQuestion('');
    }
  }

  const findStack = (stackId) => {
    for (let i = 0; i < stackInfos.length; i++) {
      if (stackInfos[i].stackId === stackId) {
        return stackInfos[i].stackName;
      }
    }

    return '존재하지 않는 스택.';
  };

  const fetchVoteInfos = async () => {
    try {
      const response = await baseAPI.get(`/api/votes?page=${currentPage}&size=10`);
      setVoteInfos(response.data.pageResponseDTO);
      setStackInfos(response.data.stackInfoDtos);
    } catch (error) {
      setModalText(error.response.data.message);
      setModalOnClick(() => () => {
        setIsGlassModalOpen(false);
      })
      setIsGlassModalOpen(true);
    }
  };

  const fetchDeleteQuestion = async () => {
    try {
      await baseAPI.delete(`/api/admin/questions/${deleteQuestionId}`);
      fetchVoteInfos();
    } catch (error) {
      setModalText(error.response.data.message);
      setModalOnClick(() => () => {
        setIsGlassModalOpen(false);
      })
      setIsGlassModalOpen(true);
    }
  }

  const fetchVote = async (questionId, stackId) => {
    try {
      await baseAPI.post(`/api/questions/${questionId}/votes`, {
        stackId: stackId
      });
      fetchVoteInfos(currentPage);
    } catch (error) {
      setModalText(error.response.data.message);
      setModalOnClick(() => () => {
        setIsGlassModalOpen(false);
      })
      setIsGlassModalOpen(true);
    }
  };

  useEffect(() => {
    const fetchVoteInfos = async () => {
      try {
        const response = await baseAPI.get(`/api/votes?page=${currentPage}&size=10`);
        setVoteInfos(response.data.pageResponseDTO);
        setStackInfos(response.data.stackInfoDtos);
      } catch (error) {
        setModalText(error.response.data.message);
        setModalOnClick(() => () => {
          setIsGlassModalOpen(false);
        })
        setIsGlassModalOpen(true);
      }
    };

    fetchVoteInfos();
  }, [currentPage]);

  return (
    <>
      <Header />
      <Wrapper>
        <div style={{ marginTop: '30px' }}>
          <Title>
            <TitleTextGroup>
              <div style={{ fontSize: '60px', fontWeight: 'bold' }}>CS 투표</div>
              <div style={{ marginTop: '40px', fontSize: '30px' }}>
                추가했으면 좋을 것 같은 질문이 있나요?
                <br />
                질문을 등록하고, 다른 사람의 질문의 카테고리를 투표해주세요!
              </div>
            </TitleTextGroup>
            <img src={img} width={'20%'} alt={'기본 이미지'}></img>
          </Title>
          <Main>
            <MainHeader>
              <CustomButton
                onClick={() => setIsModalOpen(true)}>
                질문 생성
              </CustomButton>
              <div
                style={{
                  marginTop: '80px',
                  fontSize: '25px',
                  marginLeft: '150px',
                }}
              >
                투표 결과를 바탕으로 질문이 DB에 추가될 예정이예요!
              </div>
            </MainHeader>
            <MainBody>
              {voteInfos &&
                voteInfos.resultList.map((vote, idx) => {
                  return (
                    <GlassCard key={idx}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                          style={{
                            marginTop: '50px',
                            marginBottom: '50px',
                            fontSize: '35px',
                          }}
                        >
                          Q. {vote.question}
                        </div>
                        <VoteInfoBox>
                          {vote.stackDtos &&
                            vote.stackDtos.map((stack, idx) => (
                              <div key={idx} style={{ margin: '20px' }}>
                                {vote.myVoteStackId > 0 ? (
                                  <div style={{ fontSize: '25px' }}>
                                    ({getRatio(vote.stackDtos, stack)}%)
                                  </div>
                                ) : null}
                                <CustomButton
                                  color={(vote.myVoteStackId === stack.stackId ? palette.purple : palette.dark)}
                                  isNotHover={vote.myVoteStackId !== 0}
                                  onClick={
                                    vote.myVoteStackId === 0
                                      ? () => fetchVote(vote.questionId, stack.stackId)
                                      : null
                                  }
                                >
                                  {findStack(stack.stackId)}
                                </CustomButton>
                              </div>
                            ))}
                        </VoteInfoBox>
                      </div>
                      {memberRole === 'ADMIN' && <div
                        style={{ marginTop: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <CustomButton
                          onClick={() => {
                            setInsertStackQuestion(vote);
                            setIsInsertStackModalOpen(true);
                          }}>
                          등록
                        </CustomButton>
                        <CustomButton
                          onClick={() => {
                            setDeleteQuestionId(vote.questionId);
                            setIsRemoveModalOpen(true);
                          }}>
                          삭제
                        </CustomButton>
                      </div>}
                    </GlassCard>
                  )
                })}
            </MainBody>
            <PageButtonController
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              data={voteInfos}
            />
          </Main>
          <RemoveModal
            isModalOpen={isRemoveModalOpen}
            setIsModalOpen={() => setIsRemoveModalOpen(false)}
            onClick={() => {
              fetchDeleteQuestion();
              setIsRemoveModalOpen(false);
            }} />
          <GlassModalChildren
            isModalOpen={isModalOpen}
            setIsModalOpen={() => setIsModalOpen(false)}>
            <ModalContent>
              <h2>새로운 질문 생성</h2>
              <textarea
                placeholder="질문을 입력하세요"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                style={{ width: '100%', height: '150px', padding: '10px', fontSize: '18px', marginBottom: '20px' }}
              />
              <CustomButton
                onClick={() => fetchCreateQuestion()}>
                만들기
              </CustomButton>
            </ModalContent>
          </GlassModalChildren>
          <GlassModalChildren
            isModalOpen={isInsertStackModalOpen}
            setIsModalOpen={() => {
              setSelectedStack(null);
              setIsInsertStackModalOpen(false);
            }}
            width={'700px'}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{ fontSize: '30px' }}>
                {insertStackQuestion && insertStackQuestion.question}
              </div>
              <ModalStackBox>
                {insertStackQuestion && insertStackQuestion.stackDtos &&
                  insertStackQuestion.stackDtos.map((stack, idx) => (
                    <div key={idx} style={{ margin: '20px' }}>
                      <div style={{ fontSize: '25px' }}>
                        ({getRatio(insertStackQuestion.stackDtos, stack)}%)
                      </div>
                      <CustomButton
                        color={selectedStack === stack.stackId ? palette.purple : palette.dark}
                        onClick={() => setSelectedStack(stack.stackId)} // Set the selected stack
                      >
                        {findStack(stack.stackId)}
                      </CustomButton>
                    </div>
                  ))}
              </ModalStackBox>
              <CustomButton
                onClick={() => fetchInsertStackQuestion(insertStackQuestion.questionId)}>
                등록
              </CustomButton>
            </div>
          </GlassModalChildren>

        </div>
      </Wrapper>

      <GlassModal
        isModalOpen={isGlassModalOpen}
        setIsModalOpen={() => setIsGlassModalOpen(false)}
        message={modalText}
        onClick={modalOnClick} />
    </>
  );
};

export default Vote;

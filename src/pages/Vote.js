import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { baseAPI } from '../config';
import palette from '../styles/pallete';
import Modal from 'react-modal';
import img from '../assets/default.png';
import Header from '../components/Header';
import { RemoveModal } from '../components/modal/RemoveModal';
import { localStorageGetValue } from '../utils/CryptoUtils';

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

const QuestionInfoBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border: solid;
  border-radius: 20px;
  background-color: white;
  border-color: ${palette.skyblue};
  width: 100%;
  margin-top: 30px;
`;

const VoteInfoBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

const VoteBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid;
  border-radius: 20px;
  background-color: white;
  border-color: ${(props) => props.color};
  width: 200px;
  height: 80px;
  font-size: 20px;
  font-weight: bold;
  cursor: ${(props) => (props.hover ? 'pointer' : 'default')};
  
  ${(props) =>
    props.hover &&
    css`
      &:hover {
        background-color: ${palette.skyblue};
        color: white;
      }
    `}
`;

const StackBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid;
  border-radius: 20px;
  background-color: ${(props) => (props.selected ? palette.skyblue : 'white')};
  border-color: ${(props) => props.color};
  width: 200px;
  height: 80px;
  font-size: 20px;
  font-weight: bold;
  cursor: ${(props) => (props.hover ? 'pointer' : 'default')};
  color: ${(props) => (props.selected ? 'white' : 'black')};
  
  ${(props) =>
    props.hover &&
    css`
      &:hover {
        background-color: ${palette.skyblue};
        color: white;
      }
    `}
`;

const MyBtn = styled.button`
  background-color: ${(props) => props.color};
  border: none;
  width: 300px;
  height: 100px;
  border-radius: 20px;
  font-size: 30px;
  font-weight: bold;
  color: white;
  margin-top: 30px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const PageButton = styled.button`
  background-color: ${(props) => (props.active ? palette.skyblue : '#ccc')};
  border: none;
  margin: 0 10px;
  padding: 10px 20px;
  border-radius: 10px;
  color: ${(props) => (props.active ? 'white' : '#333')};
  font-size: 18px;
  
  &:hover {
    background-color: ${(props) => (props.active ? '#0080ff' : '#bbb')};
  }

  &:disabled {
    background-color: #eee;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
 	align-items: center;
  padding: 20px;
`;

const MySmallBtn = styled.button`
  background-color: ${(props) => props.color};
  border: none;
  width: 150px;
  height: 80px;
  border-radius: 20px;
  font-size: 30px;
  font-weight: bold;
  color: white;
  margin-top: 30px;
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

  const fetchInsertStackQuestion = async (questionId) => {
    if (!selectedStack) {
      setIsInsertStackModalOpen(false);
      return;
    }
    await baseAPI.patch(`/api/admin/questions/${questionId}`, {
      stackId: selectedStack
    });
    setIsInsertStackModalOpen(false);
    window.location.reload();
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
    await baseAPI.post('/api/questions', {
      question: newQuestion,
    });
    await fetchVoteInfos(currentPage);
    setIsModalOpen(false);
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
    const response = await baseAPI.get(`/api/votes?page=${currentPage}&size=10`);
    setVoteInfos(response.data.pageResponseDTO);
    setStackInfos(response.data.stackInfoDtos);
  };

  const fetchDeleteQuestion = async () => {
    await baseAPI.delete(`/api/admin/questions/${deleteQuestionId}`);
    fetchVoteInfos();
  }

  const fetchVote = async (questionId, stackId) => {
    await baseAPI.post(`/api/questions/${questionId}/votes`, {
      stackId: stackId
    });
    fetchVoteInfos(currentPage);
  };

  useEffect(() => {
    const fetchVoteInfos = async () => {
      const response = await baseAPI.get(`/api/votes?page=${currentPage}&size=10`);
      setVoteInfos(response.data.pageResponseDTO);
      setStackInfos(response.data.stackInfoDtos);
    };

    fetchVoteInfos();
  }, [currentPage]);

  return (
    <>
      <Header />
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
          <MyBtn color={palette.skyblue} onClick={() => setIsModalOpen(true)}>질문 생성</MyBtn>
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
                <QuestionInfoBox key={idx}>
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
                            <VoteBox
                              color={(vote.myVoteStackId === 0 || vote.myVoteStackId === stack.stackId ? palette.skyblue : palette.gray)}
                              hover={vote.myVoteStackId === 0}
                              onClick={
                                vote.myVoteStackId === 0
                                  ? () => fetchVote(vote.questionId, stack.stackId)
                                  : null
                              }
                            >
                              {findStack(stack.stackId)}
                            </VoteBox>
                          </div>
                        ))}
                    </VoteInfoBox>
                  </div>
                  {memberRole === 'ADMIN' && <div
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <MySmallBtn
                      color={palette.skyblue}
                      onClick={() => {
                        setInsertStackQuestion(vote);
                        setIsInsertStackModalOpen(true);
                      }}>
                      등록
                    </MySmallBtn>
                    <MySmallBtn
                      color={palette.skyblue}
                      onClick={() => {
                        setDeleteQuestionId(vote.questionId);
                        setIsRemoveModalOpen(true);
                      }}>
                      삭제
                    </MySmallBtn>
                  </div>}
                </QuestionInfoBox>
              )
            })}
        </MainBody>
        {voteInfos && (
          <PaginationContainer>
            <PageButton
              onClick={() => {
                setCurrentPage(currentPage - 1);
              }}
              disabled={currentPage === 0}
            >
              이전
            </PageButton>
            {voteInfos.pageList.map((page) => (
              <PageButton
                key={page}
                onClick={() => {
                  setCurrentPage(page - 1);
                }}
                active={currentPage === page - 1}
              >
                {page}
              </PageButton>
            ))}
            <PageButton
              onClick={() => {
                setCurrentPage(currentPage + 1);
              }}
              disabled={currentPage === voteInfos.totalPage - 1}
            >
              다음
            </PageButton>
          </PaginationContainer>
        )}
      </Main>
      <RemoveModal
        isModalOpen={isRemoveModalOpen}
        setIsModalOpen={() => setIsRemoveModalOpen(false)}
        onClick={() => {
          fetchDeleteQuestion();
          setIsRemoveModalOpen(false);
        }} />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            top: '200px',
            left: '500px',
            right: '500px',
            bottom: '100px',
            borderRadius: '30px',
            border: 'none',
            background: `${palette.pink}`,
          }
        }}
      >
        <ModalContent>
          <h2>새로운 질문 생성</h2>
          <textarea
            placeholder="질문을 입력하세요"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            style={{ width: '100%', height: '150px', padding: '10px', fontSize: '18px', marginBottom: '20px' }}
          />
          <MyBtn color={palette.skyblue} onClick={() => fetchCreateQuestion()}>만들기</MyBtn>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isInsertStackModalOpen}
        onRequestClose={() => {
          setSelectedStack(null);
          setIsInsertStackModalOpen(false);
        }}
        style={{
          content: {
            top: '100px',
            left: '400px',
            right: '400px',
            bottom: '100px',
            borderRadius: '30px',
            border: 'none',
            background: `${palette.pink}`,
          }
        }}
      >
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
                  <StackBox
                    color={palette.skyblue}
                    selected={selectedStack === stack.stackId} // Check if the stack is selected
                    hover={true}
                    onClick={() => setSelectedStack(stack.stackId)} // Set the selected stack
                  >
                    {findStack(stack.stackId)}
                  </StackBox>
                </div>
              ))}
          </ModalStackBox>
          <MyBtn
            color={palette.skyblue}
            onClick={() => fetchInsertStackQuestion(insertStackQuestion.questionId)}>
            등록
          </MyBtn>
        </div>
      </Modal>
    </>
  );
};

export default Vote;

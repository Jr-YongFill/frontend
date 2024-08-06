import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { baseAPI } from "../config";
import palette from "../styles/pallete";
import Modal from "react-modal";
import img from "../assets/vote.png";
import Header from "../components/Header";
import Wrapper from "../components/Wrapper";
import GlassCard from "../components/GlassCard";
import { RemoveModal } from "../components/modal/RemoveModal";
import { localStorageGetValue } from "../utils/CryptoUtils";
import GlassModal from "../components/modal/GlassModal";
import PageButtonController from "../components/PageButtonController";
import GlassModalChildren from "../components/modal/GlassModalChildren";
import CustomButton from "../components/CustomButton";
import Block from "../components/Block";
import { endOfDay } from "date-fns";

const SubTitleText = styled.div`
  margin-top: 40px;
  font-size: 0.8em;
  font-weight: bold;
`;

const DescriptionText = styled.div`
  margin-top: 10px;
  font-size: 0.4em;
  color: ${palette.gray};
`;
const Main = styled.div`
  display: flex;
  margin: 0px 50px;
  flex-direction: column;
`;

const MainHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 1.5em;
  padding: 10px 0px;
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

const fetchData = async (apiCall, successHandler, errorHandler) => {
  try {
    const response = await apiCall();
    successHandler(response);
  } catch (error) {
    errorHandler(error);
  }
};

const Vote = () => {
  const navigate = useNavigate();
  const memberRole = localStorageGetValue("member-role");
  const [voteInfos, setVoteInfos] = useState(null);
  const [stackInfos, setStackInfos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState(0);
  const [isInsertStackModalOpen, setIsInsertStackModalOpen] = useState(false);
  const [insertStackQuestion, setInsertStackQuestion] = useState(null);
  const [selectedStack, setSelectedStack] = useState(null);

  const [isGlassModalOpen, setIsGlassModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalOnClick, setModalOnClick] = useState(null);

  const handleError = (error) => {
    setModalText(error.response.data.message);
    setModalOnClick(() => () => {
      setIsGlassModalOpen(false);
    });
    setIsGlassModalOpen(true);
  };

  const handleVoteInfoSuccess = (response) => {
    setVoteInfos(response.data.pageResponseDTO);
    setStackInfos(response.data.stackInfoDtos);
  };

  const fetchVoteInfos = () => {
    fetchData(
      () => baseAPI.get(`/api/votes?page=${currentPage}&size=10`),
      handleVoteInfoSuccess,
      handleError
    );
  };

  const handleCreateQuestionSuccess = () => {
    fetchVoteInfos(currentPage);
    setNewQuestion("");
    setIsModalOpen(false);
  };

  const fetchCreateQuestion = () => {
    fetchData(
      () => baseAPI.post("/api/questions", { question: newQuestion }),
      handleCreateQuestionSuccess,
      handleError
    );
  };

  const handleDeleteQuestionSuccess = () => {
    fetchVoteInfos();
  };

  const fetchDeleteQuestion = () => {
    fetchData(
      () => baseAPI.delete(`/api/admin/questions/${deleteQuestionId}`),
      handleDeleteQuestionSuccess,
      handleError
    );
  };

  const handleInsertStackQuestionSuccess = () => {
    setIsInsertStackModalOpen(false);
    window.location.reload();
  };

  const fetchInsertStackQuestion = (questionId) => {
    if (!selectedStack) {
      setIsInsertStackModalOpen(false);
      return;
    }
    fetchData(
      () =>
        baseAPI.patch(`/api/admin/questions/${questionId}`, {
          stackId: selectedStack,
        }),
      handleInsertStackQuestionSuccess,
      handleError
    );
  };

  const fetchVote = (questionId, stackId) => {
    fetchData(
      () =>
        baseAPI.post(`/api/questions/${questionId}/votes`, {
          stackId: stackId,
        }),
      fetchVoteInfos,
      handleError
    );
  };

  const getRatio = (vote, stack) => {
    let sum = vote.reduce((acc, v) => acc + v.voteCount, 0);
    let stackVoteCount =
      vote.find((v) => v.stackId === stack.stackId)?.voteCount || 0;
    return sum === 0 ? 0 : Math.round((stackVoteCount / sum) * 100);
  };

  const findStack = (stackId) => {
    return (
      stackInfos.find((stack) => stack.stackId === stackId)?.stackName ||
      "존재하지 않는 스택."
    );
  };

  useEffect(() => {
    fetchVoteInfos();
  }, [currentPage]);

  return (
    <>
      <Header />
      <Wrapper>
        <div style={{ margin: "auto 0" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Block />
            <GlassCard width={"60vw"}>
              <div
                style={{
                  height: "35vh",
                  margin: "40px 8vw 0px 8vw",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h1>CS 투표</h1>
                  <SubTitleText>
                    <h1>내가 등록한 질문이 DB에 등록되면</h1>
                    <h1>포인트를 얻을 수 있어요</h1>
                  </SubTitleText>
                  <DescriptionText>
                    질문을 등록하거나 투표를 하면 크레딧을 받아요
                  </DescriptionText>
                </div>
                <img src={img} width={"40%"} alt={"기본 이미지"}></img>
              </div>
              <div style={{ display: "flex", marginLeft: "10vw" }}>
                <CustomButton
                  width={"100px"}
                  onClick={() => setIsModalOpen(true)}
                >
                  질문 생성
                </CustomButton>
              </div>
            </GlassCard>
            <Main>
              <MainHeader>
                투표 결과를 바탕으로 질문이 DB에 추가될 예정이예요!
              </MainHeader>
              <MainBody>
                {voteInfos &&
                  voteInfos.resultList.map((vote, idx) => (
                    <GlassCard key={idx} width={"60vw"}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            marginTop: "50px",
                            marginBottom: "50px",
                            fontSize: "35px",
                          }}
                        >
                          Q. {vote.question}
                        </div>
                        <VoteInfoBox>
                          {vote.stackDtos &&
                            vote.stackDtos.map((stack, idx) => (
                              <div key={idx} style={{ margin: "20px" }}>
                                {vote.myVoteStackId > 0 ? (
                                  <div style={{ fontSize: "25px" }}>
                                    ({getRatio(vote.stackDtos, stack)}%)
                                  </div>
                                ) : null}
                                <CustomButton
                                  width={"150px"}
                                  color={
                                    vote.myVoteStackId === stack.stackId
                                      ? palette.purple
                                      : palette.dark
                                  }
                                  isNotHover={vote.myVoteStackId !== 0}
                                  onClick={
                                    vote.myVoteStackId === 0
                                      ? () =>
                                          fetchVote(
                                            vote.questionId,
                                            stack.stackId
                                          )
                                      : null
                                  }
                                >
                                  {findStack(stack.stackId)}
                                </CustomButton>
                              </div>
                            ))}
                        </VoteInfoBox>
                      </div>
                      {memberRole === "ADMIN" && (
                        <div
                          style={{
                            marginTop: "10px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                          }}
                        >
                          <CustomButton
                            onClick={() => {
                              setInsertStackQuestion(vote);
                              setIsInsertStackModalOpen(true);
                            }}
                          >
                            등록
                          </CustomButton>
                          <CustomButton
                            onClick={() => {
                              setDeleteQuestionId(vote.questionId);
                              setIsRemoveModalOpen(true);
                            }}
                          >
                            삭제
                          </CustomButton>
                        </div>
                      )}
                    </GlassCard>
                  ))}
              </MainBody>
              <PageButtonController
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                data={voteInfos}
              />
            </Main>
          </div>
        </div>
        <RemoveModal
          isModalOpen={isRemoveModalOpen}
          setIsModalOpen={() => setIsRemoveModalOpen(false)}
          onClick={() => {
            fetchDeleteQuestion();
            setIsRemoveModalOpen(false);
          }}
        />
        <GlassModalChildren
          isModalOpen={isModalOpen}
          setIsModalOpen={() => setIsModalOpen(false)}
        >
          <ModalContent>
            <h2>새로운 질문 생성</h2>
            <textarea
              placeholder="질문을 입력하세요"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              style={{
                width: "100%",
                height: "150px",
                padding: "10px",
                fontSize: "18px",
                marginBottom: "20px",
              }}
            />
            <CustomButton onClick={fetchCreateQuestion}>만들기</CustomButton>
          </ModalContent>
        </GlassModalChildren>
        <GlassModalChildren
          isModalOpen={isInsertStackModalOpen}
          setIsModalOpen={() => {
            setSelectedStack(null);
            setIsInsertStackModalOpen(false);
          }}
          width={"700px"}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "30px" }}>
              {insertStackQuestion && insertStackQuestion.question}
            </div>
            <ModalStackBox>
              {insertStackQuestion &&
                insertStackQuestion.stackDtos.map((stack, idx) => (
                  <div key={idx} style={{ margin: "20px" }}>
                    <div style={{ fontSize: "25px" }}>
                      ({getRatio(insertStackQuestion.stackDtos, stack)}%)
                    </div>
                    <CustomButton
                      color={
                        selectedStack === stack.stackId
                          ? palette.purple
                          : palette.dark
                      }
                      onClick={() => setSelectedStack(stack.stackId)}
                    >
                      {findStack(stack.stackId)}
                    </CustomButton>
                  </div>
                ))}
            </ModalStackBox>
          </div>
          <CustomButton
            onClick={() =>
              fetchInsertStackQuestion(insertStackQuestion.questionId)
            }
          >
            등록
          </CustomButton>
        </GlassModalChildren>
      </Wrapper>

      <GlassModal
        isModalOpen={isGlassModalOpen}
        setIsModalOpen={() => setIsGlassModalOpen(false)}
        message={modalText}
        onClick={modalOnClick}
      />
    </>
  );
};

export default Vote;

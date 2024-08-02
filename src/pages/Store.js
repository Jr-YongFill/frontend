import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { baseAPI } from "../config";
import palette from "../styles/pallete";
import Modal from "react-modal";
import Header from "../components/Header";
import {
  localStorageGetValue,
  localStorageSetValue,
} from "../utils/CryptoUtils";
import Wrapper from "../components/Wrapper";
import Block from "../components/Block";
import GlassCard from "../components/GlassCard";

//TODO: 이미지 적용하기 


const Title = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  // background-color: gold;
  margin: 30px 50px;
`;

const Main = styled.div`
  display: flex;
  // background-color: gold;
  margin: 0px 50px;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.div`
  display: grid;
  margin: 20px 20px;
  grid-template-columns: 1fr 1fr 1fr;
`;

const MyBtn = styled.button`
  background-color: ${(props) => props.color};
  border: none;
  border-radius: 20px;
  font-size: 1em;
  font-weight: semiBold;
  color: white;
  margin: 30px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalTextBox = styled.div`
  margin-top: 30px;
  font-size: 25px;
  font-weight: bold;
`;

const StackNameInput = styled.input`
  flex-grow: 1;
  padding: 8px 15px;
  width: 80%;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 10px;
`;

const StackDescriptInput = styled.textarea`
  flex-grow: 1;
  padding: 8px 15px;
  width: 80%;
  height: 70px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 10px;
`;

const Store = () => {
  const memberId = localStorageGetValue("member-id");
  const memberRole = localStorageGetValue("member-role");
  const [credit, setCredit] = useState(0);
  const [stacks, setStacks] = useState(null);
  const [modalSwitch, setModalSwitch] = useState(false);
  const [modalAdminSwitch, setModalAdminSwitch] = useState(false);
  const [modalAdminUpdateSwitch, setModalAdminUpdateSwitch] = useState(false);
  const [stackDescription, setStackDescript] = useState("");
  const [stackName, setStackName] = useState("");
  const [modalStack, setModalStack] = useState(null);
  const myModalTextBoxRef = useRef(null);
  const myModalBtnRef = useRef(null);
  const navigate = useNavigate(); // useNavigate를 호출

  const fetchUpdateStack = (stackId) => {
    baseAPI.patch(`/api/admin/stacks/${stackId}`, {
      stackName: stackName,
      price: 100,
      description: stackDescription,
    });
    setModalAdminUpdateSwitch(false);
    setModalSwitch(false);
    window.location.reload();
  };

  const fetchInitStack = () => {
    baseAPI.post(`/api/admin/stacks`, {
      stackName: stackName,
      price: 100,
      description: stackDescription,
    });
    setModalAdminSwitch(false);
    window.location.reload();
  };

  const fetchPurchasStack = async (stackId) => {
    try {
      await baseAPI.post(`/api/stacks/${stackId}`);
      window.location.reload();
    } catch (err) {
      myModalTextBoxRef.current.style.color = "red";
      myModalTextBoxRef.current.innerText = "크레딧이 부족합니다.";
      myModalBtnRef.current.innerText = "닫기";
      myModalBtnRef.current.addEventListener("click", () => {
        setModalSwitch(false);
      });
    }
  };

  const fetchMemberStack = async () => {
    const response = await baseAPI.get(`/api/members/${memberId}/stacks`);
    setStacks(response.data);
  };

  useEffect(() => {
    const fetchMemberStack = async () => {
      const response = await baseAPI.get(`/api/members/${memberId}/stacks`);
      setStacks(response.data);
    };

    const fetchMemberCredit = async () => {
      const response = await baseAPI.get(`/api/members/${memberId}/credit`);
      setCredit(response.data);
    };
    fetchMemberStack();
    fetchMemberCredit();
  }, [memberId]);

  return (
    <>
      <Header />
      <Wrapper>
        <Block></Block>
        <div>
          <GlassCard>
            <Title>
              <h1>Stack 상점</h1>
              <h1>내 크레딧: {credit}</h1>
            </Title>
            <Main>
              <Content>
                {stacks &&
                  stacks.map((stack, idx) => {
                    return (
                      <MyBtn
                        key={idx}
                        color={
                          stack.isPurchase ? palette.purple : palette.dark
                        }
                        onClick={() => {
                          setModalSwitch(true);
                          setModalStack(stacks.at(idx));
                        }}
                      >
                        {stack.stackName}
                      </MyBtn>
                    );
                  })}
              </Content>
              <div style={{ display: "flex" }}>
                <MyBtn
                  color={palette.skyblue}
                  onClick={() => navigate("/interview/main")}
                >
                  면접 보러가기
                </MyBtn>
                {memberRole === "ADMIN" && (
                  <MyBtn
                    color={palette.skyblue}
                    onClick={() => setModalAdminSwitch(true)}
                  >
                    스택 생성
                  </MyBtn>
                )}
              </div>
              <Modal
                isOpen={modalAdminSwitch}
                onRequestClose={() => setModalAdminSwitch(false)}
                style={{
                  content: {
                    top: "100px",
                    left: "500px",
                    right: "500px",
                    bottom: "100px",
                    borderRadius: "30px",
                    border: "none",
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  },
                }}
              >
                <ModalContent>
                  <ModalTextBox style={{ "margin-bottom": "50px" }}>
                    Stack의 정보를 입력해주십시요.
                  </ModalTextBox>
                  <div style={{ fontSize: "20px" }}>Stack Name</div>
                  <StackNameInput
                    type="text"
                    value={stackName}
                    onChange={(e) => setStackName(e.target.value)}
                    placeholder="스택 이름"
                  />
                  <div style={{ fontSize: "20px" }}>Stack 설명</div>
                  <StackDescriptInput
                    value={stackDescription}
                    onChange={(e) => setStackDescript(e.target.value)}
                    placeholder="스택 설명"
                  />
                  <MyBtn
                    color={palette.skyblue}
                    onClick={() => fetchInitStack()}
                  >
                    생성
                  </MyBtn>
                </ModalContent>
              </Modal>
              <Modal
                isOpen={modalAdminUpdateSwitch}
                onRequestClose={() => setModalAdminUpdateSwitch(false)}
                style={{
                  content: {
                    top: "100px",
                    left: "500px",
                    right: "500px",
                    bottom: "100px",
                    borderRadius: "30px",
                    border: "none",
                    background: `${palette.pink}`,
                  },
                }}
              >
                <ModalContent>
                  <ModalTextBox style={{ "margin-bottom": "50px" }}>
                    Stack의 정보 수정
                  </ModalTextBox>
                  <div style={{ fontSize: "20px" }}>Stack Name</div>
                  <StackNameInput
                    type="text"
                    value={stackName}
                    onChange={(e) => setStackName(e.target.value)}
                    placeholder="스택 이름"
                  />
                  <div style={{ fontSize: "20px" }}>Stack 설명</div>
                  <StackDescriptInput
                    value={stackDescription}
                    onChange={(e) => setStackDescript(e.target.value)}
                    placeholder="스택 설명"
                  />
                  <MyBtn
                    color={palette.skyblue}
                    onClick={() => fetchUpdateStack(modalStack.id)}
                  >
                    수정
                  </MyBtn>
                </ModalContent>
              </Modal>
              <Modal
                isOpen={modalSwitch}
                onRequestClose={() => setModalSwitch(false)}
                style={{
                  content: {
                    top: "200px",
                    left: "450px",
                    right: "450px",
                    bottom: "200px",
                    borderRadius: "30px",
                    border: "none",
                    background: `${palette.pink}`,
                  },
                }}
              >
                {modalStack && (
                  <ModalContent>
                    {modalStack.isPurchase ? (
                      <>
                        <ModalTextBox style={{ "margin-bottom": "125px" }}>
                          이미 구매한 질문입니다.
                        </ModalTextBox>
                        <div style={{ display: "flex" }}>
                          <MyBtn
                            color={palette.skyblue}
                            onClick={() => setModalSwitch(false)}
                          >
                            닫기
                          </MyBtn>
                          {memberRole === "ADMIN" && (
                            <MyBtn
                              color={palette.skyblue}
                              onClick={() => {
                                setStackName(modalStack.stackName);
                                setStackDescript(modalStack.description);
                                setModalSwitch(false);
                                setModalAdminUpdateSwitch(true);
                              }}
                            >
                              스택 수정
                            </MyBtn>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <ModalTextBox ref={myModalTextBoxRef}>
                          해당 질문 카테고리를 구매하시겠습니까?
                        </ModalTextBox>
                        <ModalTextBox>
                          {modalStack.stackName} : {modalStack.description}
                        </ModalTextBox>
                        <ModalTextBox>포인트 : {modalStack.price}</ModalTextBox>
                        <div style={{ display: "flex" }}>
                          <MyBtn
                            ref={myModalBtnRef}
                            color={palette.skyblue}
                            onClick={() => {
                              fetchPurchasStack(modalStack.id);
                            }}
                          >
                            구매
                          </MyBtn>
                          {memberRole === "ADMIN" && (
                            <MyBtn
                              color={palette.skyblue}
                              onClick={() => {
                                setStackName(modalStack.stackName);
                                setStackDescript(modalStack.description);
                                setModalSwitch(false);
                                setModalAdminUpdateSwitch(true);
                              }}
                            >
                              스택 수정
                            </MyBtn>
                          )}
                        </div>
                      </>
                    )}
                  </ModalContent>
                )}
              </Modal>
            </Main>
          </GlassCard>
        </div>
      </Wrapper>
    </>
  );
};

export default Store;

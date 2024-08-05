  import React, { useEffect, useRef, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import styled from "styled-components";
  import { baseAPI } from "../config";
  import palette from "../styles/pallete";
  import Modal from "react-modal";
  import Header from "../components/Header";
  import {
    localStorageGetValue,
  } from "../utils/CryptoUtils";
  import Wrapper from "../components/Wrapper";
  import Block from "../components/Block";
  import GlassCard from "../components/GlassCard";
  import GlassModal from "../components/modal/GlassModal";
  import GlassModalChildren from "../components/modal/GlassModalChildren";
  import CustomButton from '../components/CustomButton';
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
    grid-gap: 30px;
  `;

  const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin:0 30px;
    word-break: keep-all;
  `;

  const ModalTextBox = styled.div`
    margin-top: 30px;
    font-size: 25px;
    color: white;
  `;

  const StackNameInput = styled.input`
    flex-grow: 1;
    padding: 8px 15px;
    width: 80%;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
  `;

  const StackDescriptInput = styled.textarea`
    flex-grow: 1;
    padding: 8px 15px;
    width: 80%;
    height: 70px;
    font-size: 0.8em;
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState('');
    const [modalOnClick, setModalOnClick] = useState(null);

    const [creditInfoModal, setCreditInfoModal] = useState(false);

    const fetchUpdateStack = async (stackId) => {
      try {
        await baseAPI.patch(`/api/admin/stacks/${stackId}`, {
          stackName: stackName,
          price: 100,
          description: stackDescription,
        });
        setModalAdminUpdateSwitch(false);
        setModalSwitch(false);
        window.location.reload();
      } catch (error) {
        setModalText(error.response.data.message);
        setModalOnClick(() => () => {
          setIsModalOpen(false);
        })
        setIsModalOpen(true);
      }
    };

    const fetchInitStack = async () => {
      try {
        await baseAPI.post(`/api/admin/stacks`, {
          stackName: stackName,
          price: 100,
          description: stackDescription,
        });
        setModalAdminSwitch(false);
        setStackDescript('');
        setStackName('');
        window.location.reload();
      } catch (error) {
        setModalText(error.response.data.message);
        setModalOnClick(() => () => {
          setIsModalOpen(false);
        })
        setIsModalOpen(true);
      }
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

    useEffect(() => {
      const fetchMemberStack = async () => {
        try {
          const response = await baseAPI.get(`/api/members/${memberId}/stacks`);
          setStacks(response.data);
        } catch (error) {
          setModalText(error.response.data.message);
          setModalOnClick(() => () => {
            setIsModalOpen(false);
          })
          setIsModalOpen(true);
        }
      };

      const fetchMemberCredit = async () => {
        try {
          const response = await baseAPI.get(`/api/members/${memberId}/credit`);
          setCredit(response.data);
        } catch (error) {
          setModalText(error.response.data.message);
          setModalOnClick(() => () => {
            setIsModalOpen(false);
          })
          setIsModalOpen(true);
        }
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
                <h1
                  onClick={() => setCreditInfoModal(true)}
                >내 크레딧: {credit}</h1>
              </Title>
              <Main>
                <Content>
                  {stacks &&
                    stacks.map((stack, idx) => {
                      return (
                        <CustomButton
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
                        </CustomButton>
                      );
                    })}
                </Content>
                <div style={{ marginTop: '20px', width: '100%', display: "flex", flexDirection: 'row', justifyContent: 'space-around' }}>
                  <CustomButton
                    onClick={() => navigate("/interview/main")}
                  >
                    면접 보러가기
                  </CustomButton>
                  {memberRole === "ADMIN" && (
                    <CustomButton
                      onClick={() => setModalAdminSwitch(true)}
                    >
                      스택 생성
                    </CustomButton>
                  )}
                </div>
              </Main>
            </GlassCard>
          </div>
        </Wrapper >


        <GlassModalChildren
          isModalOpen={modalAdminSwitch}
          setIsModalOpen={() => setModalAdminSwitch(false)}>
          <ModalContent>
            <ModalTextBox style={{ marginBottom: "20px" }}>
              Stack의 정보를 입력해주십시요.
            </ModalTextBox>
            <div style={{ fontSize: "20px", color: 'white' }}>Stack Name</div>
            <StackNameInput
              type="text"
              value={stackName}
              onChange={(e) => setStackName(e.target.value)}
              placeholder="스택 이름"
            />
            <div style={{ fontSize: "20px", color: 'white' }}>Stack 설명</div>
            <StackDescriptInput
              value={stackDescription}
              onChange={(e) => setStackDescript(e.target.value)}
              placeholder="스택 설명"
              style={{ marginBottom: '20px' }}
            />
            <CustomButton
              onClick={() => fetchInitStack()}
            >
              생성
            </CustomButton>
          </ModalContent>
        </GlassModalChildren>
        <GlassModalChildren
          isModalOpen={modalAdminUpdateSwitch}
          setIsModalOpen={() => {
            setModalAdminUpdateSwitch(false);
            setStackDescript('');
            setStackName('');
          }}>
          <ModalContent>
            <ModalTextBox style={{ marginBottom: "20px" }}>
              Stack의 정보 수정
            </ModalTextBox>
            <div style={{ fontSize: "20px", color: 'white' }}>Stack Name</div>
            <StackNameInput
              type="text"
              value={stackName}
              onChange={(e) => setStackName(e.target.value)}
              placeholder="스택 이름"
            />
            <div style={{ fontSize: "20px", color: 'white' }}>Stack 설명</div>
            <StackDescriptInput
              value={stackDescription}
              onChange={(e) => setStackDescript(e.target.value)}
              placeholder="스택 설명"
              style={{ marginBottom: "20px" }}
            />
            <CustomButton
              onClick={() => fetchUpdateStack(modalStack.id)}
            >
              수정
            </CustomButton>
          </ModalContent>
        </GlassModalChildren>
        <GlassModalChildren
          isModalOpen={modalSwitch}
          setIsModalOpen={() => setModalSwitch(false)}>
          {modalStack && (
            <ModalContent>
              {modalStack.isPurchase ? (
                <>
                  <ModalTextBox style={{ "margin-bottom": "125px" }}>
                    이미 구매한 질문입니다.
                  </ModalTextBox>
                  <div style={{ marginTop: '20px', display: "flex", width: '100%', justifyContent: 'space-around' }}>
                    <CustomButton
                      onClick={() => setModalSwitch(false)}
                    >
                      닫기
                    </CustomButton>
                    {memberRole === "ADMIN" && (
                      <CustomButton
                        onClick={() => {
                          setStackName(modalStack.stackName);
                          setStackDescript(modalStack.description);
                          setModalSwitch(false);
                          setModalAdminUpdateSwitch(true);
                        }}
                      >
                        스택 수정
                      </CustomButton>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <ModalTextBox ref={myModalTextBoxRef}>
                    해당 질문 카테고리를 구매하시겠습니까?
                  </ModalTextBox>
                  <ModalTextBox>
                    {modalStack.stackName}
                    <br />
                    <div style={{ fontSize: '0.6em' }}>
                      {modalStack.description}</div>
                  </ModalTextBox>
                  <ModalTextBox>포인트 : {modalStack.price}</ModalTextBox>
                  <div style={{ marginTop: '20px', display: "flex", width: '100%', justifyContent: 'space-around' }}>
                    <CustomButton
                      myRef={myModalBtnRef}
                      onClick={() => {
                        fetchPurchasStack(modalStack.id);
                      }}
                    >
                      구매
                    </CustomButton>
                    {memberRole === "ADMIN" && (
                      <CustomButton
                        onClick={() => {
                          setStackName(modalStack.stackName);
                          setStackDescript(modalStack.description);
                          setModalSwitch(false);
                          setModalAdminUpdateSwitch(true);
                        }}
                      >
                        스택 수정
                      </CustomButton>
                    )}
                  </div>
                </>
              )}
            </ModalContent>
          )}
        </GlassModalChildren>

        <GlassModalChildren
          isModalOpen={creditInfoModal}
          setIsModalOpen={() => setCreditInfoModal(false)}>
          <h1 style={{ color: 'white' }}>크레딧을 얻는 방법!</h1>
          <ul style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
            <li>면접 질문을 올리고 채택이 된다: 10pt</li>
            <li>면접 질문을 투표 한다: 1pt </li>
            <li>면접 질문에 답을 한다: 1pt </li>
            <li>연습 모드를 한다: 답변 당 2pt </li>
            <li>실전 모드를 한다: 30pt <br />
              - 단 스킵할때 마다: -5pt <br />
              - 최소 0pt</li>
          </ul>
          <CustomButton
            onClick={() => setCreditInfoModal(false)}>
            닫기
          </CustomButton>
        </GlassModalChildren >

        <GlassModal
          isModalOpen={isModalOpen}
          setIsModalOpen={() => setIsModalOpen(false)}
          message={modalText}
          onClick={modalOnClick} />
      </>
    );
  };

  export default Store;

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styled from "styled-components";
import palette from "../../styles/pallete";
import { baseAPI } from "../../config";
import Modal from "react-modal";
import { localStorageGetValue } from "../../utils/CryptoUtils";



const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 30px 50px;
  align-items: center;
`;

const Main = styled.div`
  display: flex;
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
  border:none;
  width: 300px;
  height: 100px;
  border-radius: 20px;
  font-size: 30px;
  font-weight: bold;
  color: white;
  margin: 30px;
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

const ModalTextInput = styled.input`
    background-color: lightgray;
    border: lightgray solid 20px;
    width: 460px;
    height: 60px;
    border-radius: 20px;
    font-size: 30px;
    font-weight: bold;
    color: black;
    margin: 30px;
    
`


const InterviewChoiceStack = () => {

  const memberId = localStorageGetValue('member-id');;
  const [stacks, setStacks] = useState([]);
  const [modalSwitch, setModalSwitch] = useState(false);

  const [apiKey, setApiKey] = useState("");
  const myModalTextBoxRef = useRef(null);
  const myModalBtnRef = useRef(null);
  const navigate = useNavigate();


  const fetchMemberStack = useCallback(async () => {
    try {
      const response = await baseAPI.get(`/api/members/${memberId}/stacks`);
      setStacks(response.data.filter(stack => stack.isPurchase).map(stack => ({ ...stack, selected: false })));
    } catch (error) {
      console.error("Failed to fetch stacks:", error);
    }
  }, [memberId]);


  useEffect(() => {
    fetchMemberStack();
  }, [fetchMemberStack]);

  return (
    <>
      <Header />
      <Title>
        <h1>이력서에 어떤 스택으로 지원하셨나요?</h1>
        <h3>잠긴 스택은 상점에서 구매가 필요합니다.</h3>
      </Title>
      <Main>
        <Content>
          {stacks && stacks.map((stack, idx) => {
            return <MyBtn
              key={idx}
              color={stack.selected ? palette.blue : palette.skyblue}
              onClick={() => {
                if (stack.isPurchase) {
                  setStacks(stacks.map((s) =>
                    s.id === stack.id ? { ...s, selected: !s.selected } : s
                  ));
                }
              }}

            >{stack.stackName}</MyBtn>
          })}
        </Content>
        <MyBtn color={palette.blue} onClick={() => setModalSwitch(true)}>면접 보러가기</MyBtn>
        {/*<MyBtn color={palette.blue} onClick={() => navigate('/interview/practice')}>면접 보러가기</MyBtn>*/}
        <Modal
          isOpen={modalSwitch}
          onRequestClose={() => setModalSwitch(false)}
          style={{
            content: {
              top: '200px',
              left: '500px',
              right: '500px',
              bottom: '200px',
              borderRadius: '30px',
              border: 'none',
              background: `${palette.pink}`,
            }
          }}>
          <ModalContent>
            {
              stacks.filter(stack => stack.selected).length ?
                <>
                  <ModalTextBox>
                    <h2>모의 면접을 위해서는<br />GPT API 키가 필요합니다.</h2>
                  </ModalTextBox>
                  <ModalTextBox
                    color={palette.gray}
                    onClick={() => window.open('https://openai.com/index/openai-api/')}
                  >
                    API 키는 어떻게 얻나요?
                  </ModalTextBox>
                  <ModalTextBox>
                    한 문제 당 100~200원 비용이 소모됩니다!
                  </ModalTextBox>
                  <ModalTextInput
                    placeholder={"GPT API 키를 입력해주세요"}
                    onChange={(e) => setApiKey(e.target.value)} />
                  <MyBtn
                    color={palette.skyblue}
                    onClick={() => navigate('/interview', {
                      state: {
                        stackids: stacks.filter(stack => stack.selected).map(s => s.id),
                        apiKey: apiKey
                      }
                    })}>
                    면접 시작
                  </MyBtn>
                </>
                :
                <>
                  <ModalTextBox style={{ marginBottom: 400 }}>
                    <h2>스택을 선택해주세요.</h2>
                  </ModalTextBox>
                  <MyBtn
                    color={palette.skyblue}
                    onClick={() => setModalSwitch(false)}>
                    닫기
                  </MyBtn>
                </>
            }

          </ModalContent>
        </Modal>
      </Main>
    </>
  );
};

export default InterviewChoiceStack;

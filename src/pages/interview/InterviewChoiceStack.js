import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styled from "styled-components";
import palette from "../../styles/pallete";
import { baseAPI } from "../../config";
import { localStorageGetValue } from "../../utils/CryptoUtils";
import Wrapper from '../../components/Wrapper';
import GlassCard from '../../components/GlassCard';
import CustomButton from '../../components/CustomButton';
import GlassModalChildren from '../../components/modal/GlassModalChildren';
import GlassModal from '../../components/modal/GlassModal';


const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  margin: 30px 20px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 30px;
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
    height: 30px;
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
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalOnClick, setModalOnClick] = useState(null);


  const fetchMemberStack = useCallback(async () => {
    try {
      const response = await baseAPI.get(`/api/members/${memberId}/stacks`);
      setStacks(response.data.filter(stack => stack.isPurchase).map(stack => ({ ...stack, selected: false })));
    } catch (error) {
      setModalText(error.response.data.message);
      setModalOnClick(() => () => {
        setIsModalOpen(false);
      })
      setIsModalOpen(true);
    }
  }, [memberId]);


  useEffect(() => {
    fetchMemberStack();
  }, [fetchMemberStack]);

  return (
    <>
      <Header />
      <Wrapper>
        <GlassCard>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Title>
              <h1>이력서에 어떤 스택으로 지원하셨나요?</h1>
              <h3>잠긴 스택은 상점에서 구매가 필요합니다.</h3>
            </Title>
            <Main>
              <Content>
                {stacks && stacks.map((stack, idx) => {
                  return <CustomButton
                    key={idx}
                    color={stack.selected ? palette.purple : palette.dark}
                    onClick={() => {
                      if (stack.isPurchase) {
                        setStacks(stacks.map((s) =>
                          s.id === stack.id ? { ...s, selected: !s.selected } : s
                        ));
                      }
                    }}

                  >
                    {stack.stackName}
                  </CustomButton>
                })}
              </Content>
              <CustomButton
                onClick={() => setModalSwitch(true)}>
                면접 보러가기
              </CustomButton>
            </Main>
          </div>
        </GlassCard>
      </Wrapper>

      <GlassModalChildren
        isModalOpen={modalSwitch}
        setIsModalOpen={() => setModalSwitch(false)}>
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
                <CustomButton
                  onClick={() => navigate('/interview', {
                    state: {
                      stackids: stacks.filter(stack => stack.selected).map(s => s.id),
                      apiKey: apiKey
                    }
                  })}>
                  면접 시작
                </CustomButton>
              </>
              :
              <>
                <ModalTextBox>
                  <h2>스택을 선택해주세요.</h2>
                </ModalTextBox>
                <CustomButton
                  onClick={() => setModalSwitch(false)}>
                  닫기
                </CustomButton>
              </>
          }

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

export default InterviewChoiceStack;

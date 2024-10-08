import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styled from "styled-components";
import palette from "../../styles/pallete";
import { baseAPI } from "../../config";
import { localStorageGetValue } from "../../utils/CryptoUtils";
import Wrapper from '../../components/Wrapper';
import Block from '../../components/Block';
import GlassCard from '../../components/GlassCard';
import CustomButton from '../../components/CustomButton';
import GlassModalChildren from '../../components/modal/GlassModalChildren';
import GlassModal from "../../components/modal/GlassModal";
import GlassInput from '../../components/GlassInput';

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
    display: flex;
    justify-content:space-evenly;
    flex-wrap: wrap;
    margin: 20px 10vw;
    gap: 5px;
`;

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ModalTextBox = styled.div`
    color: ${(props) => props.color};
    padding: 10px 0px;
    font-weight: bold;
    text-align: center;
`;

const ModalTip = styled.div`
    color:white;
    padding: 10px 0px;
    cursor:pointer;

`

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
`;

const PracticeChoiceStack = () => {
  const memberId = localStorageGetValue('member-id');
  const [stacks, setStacks] = useState([]);
  const [modalSwitch, setModalSwitch] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalOnClick, setModalOnClick] = useState(null);
  const [modalMessage, setModalMessage] = useState('');


  const fetchMemberStack = useCallback(async () => {
    try {
      const response = await baseAPI.get(`/api/members/${memberId}/stacks`);
      setStacks(response.data.map(stack => ({ ...stack, selected: false })));
    } catch (error) {
      setModalText(error.response.data.message);
      setModalOnClick(() => () => {
        setIsModalOpen(false);
      });
      setIsModalOpen(true);
    }
  }, [memberId]);

  useEffect(() => {
    fetchMemberStack();
  }, [fetchMemberStack]);

  const handleButtonClick = (stack) => {
    if (stack.isPurchase) {
      setStacks(stacks.map((s) =>
        s.id === stack.id ? { ...s, selected: !s.selected } : s
      ));
    } else {
      setIsModalOpen(true);
      setModalText("구매가 필요한 스택입니다.");
      setModalOnClick(() => () => {
        setIsModalOpen(false);
      });
    }
  };


  const handleStartInterview = async () => {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (response.ok) {
        // API 응답이 성공적일 경우 navigate를 호출
        navigate('/interview/practice', {
          state: {
            stackids: stacks.filter(stack => stack.selected).map(s => s.id),
            apiKey: apiKey
          }
        });
      } else {
        // API 응답이 실패할 경우 모달을 표시
        setModalMessage('Api Key가 유효하지 않습니다.');
        setModalSwitch(true);
      }
    } catch (error) {
      // 네트워크 오류 또는 기타 예외 처리
      setModalMessage('Api Key가 유효하지 않습니다.');
      setModalSwitch(true);
    }
  };

  return (
    <>
      <Header />
      <Wrapper>
        <Block />
        <GlassCard width={"60vw"}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Title>
              <h1>이력서에 어떤 스택으로 지원하셨나요?</h1>
              <h3>잠긴 스택은 상점에서 구매가 필요합니다.</h3>
            </Title>
            <Main>
              <Content>
                {stacks && stacks.map((stack, idx) => (
                  <CustomButton
                    width={'150px'}
                    isNotHover={stack.isPurchase ? false : true}
                    key={idx}
                    color={stack.isPurchase
                      ? (stack.selected ? palette.purple : palette.dark) : palette.gray}
                    onClick={() => handleButtonClick(stack)}
                  >
                    {stack.stackName}
                  </CustomButton>
                ))}
              </Content>
              <CustomButton onClick={() => {
                setModalSwitch(true)
                setModalMessage('');
              }}>
                면접 보러가기
              </CustomButton>
            </Main>
          </div>
        </GlassCard>
      </Wrapper>

      <GlassModalChildren
        isModalOpen={modalSwitch}
        setIsModalOpen={() => setModalSwitch(false)}
      >
        <ModalContent>
          {stacks.filter(stack => stack.selected).length ? (
            <>
              <ModalTextBox>
                모의 면접을 위해서는<br />GPT API 키가 필요합니다.<br/>
                <div style={{fontSize:'0.5em'}}>
                  한 문제 당 100~200원 비용이 소모됩니다!</div>
              </ModalTextBox>
              <GlassInput
                width={"70%"}
                placeholder={"GPT API 키를 입력해주세요"}
                onChange={(e) => setApiKey(e.target.value)}
              />
              {modalMessage && <ModalTextBox>{modalMessage}</ModalTextBox>}
              <ModalTip
                color={palette.gray}
                onClick={() => window.open('https://openai.com/index/openai-api/')}
              >
                API 키는 어떻게 얻나요?
              </ModalTip>
              <CustomButton
                width={"33%"}
                onClick={handleStartInterview}>
                면접 시작
              </CustomButton>
            </>
          ) : (
            <>
              <ModalTextBox>
                스택을 선택해주세요.
              </ModalTextBox>
              <CustomButton onClick={() => setModalSwitch(false)}>
                닫기
              </CustomButton>
            </>
          )}
        </ModalContent>
      </GlassModalChildren>

      <GlassModal
        isModalOpen={isModalOpen}
        setIsModalOpen={() => setIsModalOpen(false)}
        message={modalText}
        onClick={modalOnClick}
      />
    </>
  );
};

export default PracticeChoiceStack;

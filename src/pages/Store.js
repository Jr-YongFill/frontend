import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { baseAPI } from '../config';
import palette from '../styles/pallete';
import Modal from 'react-modal';
import Header from '../components/Header';
import { localStorageGetValue, localStorageSetValue } from '../utils/CryptoUtils';

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
  margin-top: 30px;
  font-size: 25px;
  font-weight: bold;
`;

const Store = () => {
  const memberId = localStorageGetValue('member-id');
  const [credit, setCredit] = useState(0);
  const [stacks, setStacks] = useState(null);
  const [modalSwitch, setModalSwitch] = useState(false);
  const [modalStack, setModalStack] = useState(null);
  const myModalTextBoxRef = useRef(null);
  const myModalBtnRef = useRef(null);
  const navigate = useNavigate(); // useNavigate를 호출

  const fetchMemberCredit = async () => {
    const response = await baseAPI.get(`/api/members/${memberId}/credit`);
    setCredit(response.data);
  }

  const fetchPurchasStack = async (stackId) => {
    try {
      await baseAPI.post(`/api/stacks/${stackId}`);
      window.location.reload();
    } catch (err) {
      myModalTextBoxRef.current.style.color = 'red';
      myModalTextBoxRef.current.innerText = '크레딧이 부족합니다.';
      myModalBtnRef.current.innerText = '닫기';
      myModalBtnRef.current.addEventListener('click', () => { setModalSwitch(false); });
    }
  }

  const fetchMemberStack = async () => {
    const response = await baseAPI.get(`/api/members/${memberId}/stacks`);
    setStacks(response.data);
  }

  useEffect(() => {

    const fetchMemberStack = async () => {
      const response = await baseAPI.get(`/api/members/${memberId}/stacks`);
      setStacks(response.data);
    }

    const fetchMemberCredit = async () => {
      const response = await baseAPI.get(`/api/members/${memberId}/credit`);
      setCredit(response.data);
    }
    fetchMemberStack();
    fetchMemberCredit();
  }, [memberId]);

  return (
    <>
      <Header />
      <Title>
        <h1>Stack 상점</h1>
        <h1>내 크레딧: {credit}</h1>
      </Title>
      <Main>
        <Content>
          {stacks && stacks.map((stack, idx) => {
            return <MyBtn
              key={idx}
              color={stack.isPurchase ? palette.skyblue : palette.gray}
              onClick={() => {
                setModalSwitch(true);
                setModalStack(stacks.at(idx));
              }}
            >{stack.stackName}</MyBtn>
          })}
        </Content>
        <MyBtn color={palette.skyblue} onClick={() => navigate('/interview/main')}>면접 보러가기</MyBtn>
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
          {modalStack &&
            <ModalContent>
              {
                modalStack.isPurchase ?
                  <>
                    <ModalTextBox style={{ 'margin-bottom': '125px' }}>
                      이미 구매한 질문입니다.
                    </ModalTextBox>
                    <MyBtn
                      color={palette.skyblue}
                      onClick={() => setModalSwitch(false)}>
                      닫기
                    </MyBtn>
                  </>
                  :
                  <>
                    <ModalTextBox ref={myModalTextBoxRef}>
                      해당 질문 카테고리를 구매하시겠습니까?
                    </ModalTextBox>
                    <ModalTextBox>
                      {modalStack.stackName} : {modalStack.description}
                    </ModalTextBox>
                    <ModalTextBox>
                      포인트 : {modalStack.price}
                    </ModalTextBox>
                    <MyBtn
                      ref={myModalBtnRef}
                      color={palette.skyblue}
                      onClick={() => {
                        fetchPurchasStack(modalStack.id);
                      }}>
                      구매
                    </MyBtn>
                  </>}
            </ModalContent>}
        </Modal>
      </Main >
    </>
  );
};

export default Store;

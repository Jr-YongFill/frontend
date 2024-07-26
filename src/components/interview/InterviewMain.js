import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import palette from '../../styles/pallete';
import styled from 'styled-components';
import img from '../../assets/default.png';

const Title = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  // background-color: gold;
  margin: 50px 150px;
`;

const TitleTextGroup = styled.div`
  
`;

const BtnGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const BtnBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 50px;
  margin-right: 50px;
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
`;

const InterviewMain = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  return (
    <>
      <Header />
      <Title>
        <TitleTextGroup>
          <div style={{
            'font-size': '60px',
            'font-weight': 'bold',
          }}>
            면접 시뮬레이션
          </div>
          <div style={{
            'margin-top': '40px',
            'font-size': '30px',
            'font-weight': 'bold',
          }}>
            CS 면접, 잘 준비 되셨나요?<br />
            아는 만큼 대답해주세요!<br /><br />
            GPT가 면접 답변을 평가해줘요!
          </div>
          <div style={{
            'margin-top': '10px',
            'font-size': '20px',
            'color': '#A4A4A4'
          }}>
            기능 사용을 위해서는 Open AI API키가 필요합니다.<br /><br />
            API키 생성 방법
          </div>
        </TitleTextGroup>
        <img src={img} width={'20%'}></img>
      </Title>
      <BtnGroup>
        <BtnBox>
          <MyBtn color={palette.skyblue} onClick={() => navigate('/interview/practice-choice-stack')}>연습 선택 스택</MyBtn>
          <div style={{
            'margin-top': '10px',
            'font-size': '20px',
            'color': '#A4A4A4'
          }}>
            # 무한모드 #1문제씩_정답_확인가능
          </div>
        </BtnBox>
        <BtnBox>
          <MyBtn color={palette.skyblue} onClick={() => navigate('/interview/choice-stack')}>면접 선택 스택</MyBtn>
          <div style={{
            'margin-top': '10px',
            'font-size': '20px',
            'color': '#A4A4A4'
          }}>
            # 10개씩 #한번에_정답_확인가능
          </div>
        </BtnBox>
      </BtnGroup>
    </>
  );
};

export default InterviewMain;

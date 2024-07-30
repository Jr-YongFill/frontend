import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../assets/default.png';
import Header from '../components/Header';


const WrapperContainer = styled.div`
    height: 100vh; 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f0f4ff;
`;

const CsContainer = styled.div`
    width: 80%;
    max-width: 800px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
    padding: 20px;
    text-align: center;
`;

const CommunityContainer = styled.div`
    width: 80%;
    max-width: 800px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
    padding: 20px;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: bold;
    margin: 10px 0;
`;

const Description = styled.p`
    font-size: 16px;
    margin: 10px 0;
`;

const Button = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background-color: #0056b3;
    }
`;

const DevWrapperContainer = styled.div`
    width: 80%;
    max-width: 800px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
    padding: 20px;
    text-align: center;
`;

const DeveloperInfoContainer = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-top: 20px;
`;

const DeveloperCard = styled.div`
    background-color: #e7f3ff;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    margin: 10px;
    width: 150px;
`;
const Home = () => {
  const navigate = useNavigate();

  return (
    <>
    <Header />
      <WrapperContainer>
        <CsContainer>
          <Title>개발자들을 위한 CS 랜덤 디펜스</Title>
          <Description>멘트주세요</Description>
          <Button onClick={() => navigate('/interview/choice-mode')}>메인 페이지 이동</Button>
        </CsContainer>

        <CommunityContainer>
          <Title>취준생을 위한 커뮤니티</Title>
          <Description>멘트주세요</Description>
          <Button onClick={() => navigate('/community')}>커뮤니티 이동</Button>
        </CommunityContainer>

        <DevWrapperContainer>
          <Title>개발자 정보</Title>
          <DeveloperInfoContainer>
            <DeveloperCard>
              <img src={defaultImage} alt="Developer" style={{ width: '70px', height: '70px' }} />
              <h3>장희권</h3>
              <p>Developer</p>
              <p>contact: hgyellow0505@gmail.com</p>
            </DeveloperCard>
            <DeveloperCard>
              <img src={defaultImage} alt="Developer" style={{ width: '70px', height: '70px' }} />
              <h3>김지혜</h3>
              <p>Developer</p>
              <p>contact: cocoa389@naver.com</p>
            </DeveloperCard>
            <DeveloperCard>
              <img src={defaultImage} alt="Developer" style={{ width: '70px', height: '70px' }} />
              <h3>이동규</h3>
              <p>Developer</p>
              <p>contact:dlehdrb1112@gmail.com</p>
            </DeveloperCard>
            <DeveloperCard>
              <img src={defaultImage} alt="Developer" style={{ width: '70px', height: '70px' }} />
              <h3>배창민</h3>
              <p>Developer</p>
              <p>contact: changmin38@gmail.com</p>
            </DeveloperCard>
          </DeveloperInfoContainer>
        </DevWrapperContainer>
      </WrapperContainer>
    </>
  );
};

export default Home;

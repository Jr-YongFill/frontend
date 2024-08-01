import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../assets/default.png';
import Header from '../components/Header';
import palette from '../styles/pallete';
import { localStorageGetValue, localStorageSetValue } from '../utils/cryptoUtils';

const WrapperContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f0f4ff;
    padding: 20px;
    box-sizing: border-box;
`;

const ContainerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center; 
    justify-content: center; 
    width: 90%;
    margin: 0 auto;
    flex: 1;
`;

const Container = styled.div`
    width: 100%;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin: 10px 0;
    padding: 20px;
    text-align: left;
    flex: 4;
`;

const Title = styled.h1`
    font-weight: bold;
    margin: 10px 0;
`;

const Description = styled.p`
    font-size: 16px;
    margin: 10px 0;
`;

const Button = styled.button`
    background-color: #0056b3;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background-color: ${palette.skyblue};
    }
`;

const Label = styled.label`
    display: block;
    color: #333;
    margin-bottom: 10px;
`;

const DeveloperInfoContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
`;

const DeveloperCard = styled.div`
    background-color: #e7f3ff;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    width: 150px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    img {
        border-radius: 50%;
        width: 70px;
        height: 70px;
        object-fit: cover;
    }

    h3 {
        margin: 10px 0 5px;
        font-size: 18px;
    }

    p {
        margin: 5px 0;
        font-size: 14px;
    }
`;

const Home = () => {
  const navigate = useNavigate();

  const ButtonClick = (path) => {
    const role = localStorageGetValue('member-role');
    if (!role) {
      alert('로그인이 필요한 페이지입니다.')
      navigate('/auth/sign-in');
    } else {
      navigate(path);
    }
  };

  return (
    <div>
      <Header />
      <WrapperContainer>
        <ContainerWrapper>
          <Container>
            <Label>개발자들을 위한</Label>
            <Title>CS 랜덤 디펜스</Title>
            <Description>멘트주세요</Description>
            <Button onClick={() => ButtonClick('/interview/choice-mode')}>면접 페이지 이동</Button>
          </Container>

          <Container>
            <Label>개발자들을 위한</Label>
            <Title>취준생을 위한 커뮤니티</Title>
            <Description>멘트주세요</Description>
            <Button onClick={() => ButtonClick('/community/main')}>커뮤니티 이동</Button>
          </Container>

          <Container flex="2">
            <Title style={{ textAlign: 'center' }}>개발자 정보</Title>
            <DeveloperInfoContainer>
              <DeveloperCard>
                <img src={defaultImage} alt="Developer" />
                <h3>장희권</h3>
                <p>Developer</p>
                <p>contact: hgyellow0505@gmail.com</p>
              </DeveloperCard>
              <DeveloperCard>
                <img src={defaultImage} alt="Developer" />
                <h3>김지혜</h3>
                <p>Developer</p>
                <p>contact: cocoa389@naver.com</p>
              </DeveloperCard>
              <DeveloperCard>
                <img src={defaultImage} alt="Developer" />
                <h3>이동규</h3>
                <p>Developer</p>
                <p>contact: dlehdrb1112@gmail.com</p>
              </DeveloperCard>
              <DeveloperCard>
                <img src={defaultImage} alt="Developer" />
                <h3>배창민</h3>
                <p>Developer</p>
                <p>contact: changmin38@gmail.com</p>
              </DeveloperCard>
            </DeveloperInfoContainer>
          </Container>
        </ContainerWrapper>
      </WrapperContainer>
    </div>
  );
};

export default Home;

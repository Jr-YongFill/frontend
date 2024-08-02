import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../assets/default.png';
import csRandingImage from '../assets/rending1.png';
import communityRandingImage from '../assets/rending2.png';
import Header from '../components/Header';
import palette from '../styles/pallete';
import { localStorageGetValue, localStorageSetValue } from '../utils/CryptoUtils';
import GlassCard from '../components/GlassCard';
import Wrapper from '../components/Wrapper';
import Block from '../components/Block';

const WrapperContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #5a8db1;
  background-image: linear-gradient(0deg, #5a8db1 0%, #16193c 100%);
  padding: 20px;
  box-sizing: border-box;
  min-height: 100vh;
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

const Image = styled.img`
  width: 20vw;
`;

const Title = styled.h1`
  font-weight: bold;
  margin: 10px 0;
  color: white;
`;

const Description = styled.p`
  font-size: 16px;
  margin: 15px 0;
  color: ${palette.gray};
`;

const Button = styled.button`
  background-color: rgba(0, 86, 179, 0.7);
  width: 20vw;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 40px;

  &:hover {
    background-color: ${palette.skyblue};
  }
`;

const Label = styled.label`
  display: block;
  color: white;
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
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  width: 150px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);

  img {
    border-radius: 50%;
    width: 70px;
    height: 70px;
    object-fit: cover;
  }

  h3 {
    margin: 10px 0 5px;
    font-size: 18px;
    color:white
  }

  p {
    margin: 5px 0;
    font-size: 14px;
    
    color:${palette.gray};
  }
`;

const Home = () => {
  const navigate = useNavigate();

  const ButtonClick = (path) => {
    const role = localStorageGetValue('member-role');
    if (!role) {
      alert('로그인이 필요한 페이지입니다.');
      navigate('/auth/sign-in');
    } else {
      navigate(path);
    }
  };

  return (
    <div>
      <Header />
      <Wrapper>
        <ContainerWrapper>
        <Block></Block>
          <GlassCard>
            <div style={{margin:'40px',display:'flex',justifyContent:'space-between'}}>
              <div style={{width:'40vw'}}>
                <Label>개발자들을 위한</Label>
                <Title>모의면접</Title>
                <Title>시뮬레이터</Title>
                <Description>
                  어쩌구저쩌구
                  <br></br>
                  저쩌구
                </Description>
                <Button onClick={() => ButtonClick('/interview/choice-mode')}>면접 페이지 이동</Button>
              </div>
              <div style={{display:'block', alignContent:'center',paddingRight:'10vw'}}>
                <Image src={csRandingImage} alt="RandingImage"/>
              </div>
            
            </div>
          </GlassCard>

          <GlassCard>
            <div style={{margin:'40px',display:'flex',justifyContent:'space-between'}}>
              <div style={{width:'40vw'}}>
                <Label>개발자들을 위한</Label>
                <Title>취준생</Title>
                <Title>커뮤니티</Title>
                <Description>
                  취준생을 위한
                  <br></br>
                  커뮤니티 기능
                </Description>
                <Button onClick={() => ButtonClick('/community/main')}>커뮤니티 페이지 이동</Button>
              </div>
              <div style={{display:'block', alignContent:'center',paddingRight:'10vw'}}>
                <Image src={communityRandingImage} alt="RandingImage"/>
              </div>
            
            </div>
          </GlassCard>

          <GlassCard flex="2">
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
          </GlassCard>
        </ContainerWrapper>
        </Wrapper>
    
    </div>
  );
};

export default Home;

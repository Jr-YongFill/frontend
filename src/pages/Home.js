import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import defaultImage from "../assets/default.png";
import csRandingImage from "../assets/planet.png";
import communityRandingImage from "../assets/rending2.png";
import Header from "../components/Header";
import palette from "../styles/pallete";
import {
  localStorageGetValue,
} from "../utils/CryptoUtils";
import GlassCard from "../components/GlassCard";
import Wrapper from "../components/Wrapper";
import Block from "../components/Block";
import CustomButton from "../components/CustomButton";

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
  padding: 30px 0px;
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
    color: white;
  }

  p {
    margin: 5px 0;
    font-size: 14px;

    color: ${palette.gray};
  }
`;

const Home = () => {
  const navigate = useNavigate();

  const ButtonClick = (path) => {
    const role = localStorageGetValue("member-role");
    if (!role) {
      alert("로그인이 필요한 페이지입니다.");
      navigate("/auth/sign-in");
    } else {
      navigate(path);
    }
  };

  return (
    <div>
      <Header />
      <Wrapper>
        {/* Wrapper 아래 태그는 display:flex, flex-direction:column으로 감싸진 곳이어야함 */}
        <ContainerWrapper>
          {/* 헤더가 보여질 공간을 띄워주긴 위한 Block컴포넌트(MUI아님!!!!)을 배치해야함 */}
          <Block></Block>
          <GlassCard width={"60vw"}>
            <div
              style={{
                margin: "40px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ width: "40vw" }}>
                <Label>개발자들을 위한</Label>
                <Title>모의면접</Title>
                <Title>시뮬레이터</Title>
                <Description>
                  어쩌구저쩌구
                  <br></br>
                  저쩌구
                </Description>
                <CustomButton
                  width={"15vw"}
                  onClick={() => ButtonClick("/interview/main")}
                >
                  면접 보기
                </CustomButton>
              </div>
              <div style={{ display: "block", alignContent: "center" }}>
                <Image src={csRandingImage} alt="RandingImage" />
              </div>
            </div>
          </GlassCard>

          <GlassCard width={"60vw"}>
            <div
              style={{
                margin: "40px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ width: "40vw" }}>
                <Label>개발자들을 위한</Label>
                <Title>취준생</Title>
                <Title>커뮤니티</Title>
                <Description>
                  취준생을 위한
                  <br></br>
                  커뮤니티 기능
                </Description>
                <CustomButton
                  width={"15vw"}
                  onClick={() => ButtonClick("/community/main")}
                >
                  커뮤니티 보기
                </CustomButton>
              </div>
              <div style={{ display: "block", alignContent: "center" }}>
                <Image src={communityRandingImage} alt="RandingImage" />
              </div>
            </div>
          </GlassCard>

          <GlassCard width={"60vw"}>
            <Title style={{ textAlign: "center" }}>개발자 정보</Title>
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

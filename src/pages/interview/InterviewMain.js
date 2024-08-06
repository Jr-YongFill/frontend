import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import palette from "../../styles/pallete";
import styled from "styled-components";
import img from "../../assets/mic.png";
import Wrapper from "../../components/Wrapper";
import GlassCard from "../../components/GlassCard";
import Block from "../../components/Block";
import CustomButton from "../../components/CustomButton";




const BtnGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin: 4vh 8vw;
`;

const BtnBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content:center;
`;

const InfoText = styled.div`
  margin-top: 10px;
  font-size: 0.3em;
  color: ${palette.white};
`;

const SubTitleText = styled.div`
  margin-top: 40px;
  font-size: 0.8em;
  font-weight: bold;
`;

const DescriptionText = styled.div`
  margin-top: 2vw;
  font-size: 0.8em;
  color: ${palette.gray};
`;

const InterviewMain = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <Wrapper>
        <div style={{ margin: "auto 0" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Block></Block>
            <GlassCard width={"60vw"}>
            <div
              style={{
                height:"35vh",
                margin: "40px 8vw",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >

                  <div>
                    <h1>면접 시뮬레이션</h1>
                    <SubTitleText>
                      <h1>CS 면접, 잘 준비 되셨나요?</h1>
                      <h1>GPT와 함께 면접 연습을 해보세요!</h1>
                    </SubTitleText>
                    <DescriptionText>
                      기능 사용을 위해서는 Open AI API키가 필요합니다.
                    </DescriptionText>
                  </div>
                  <img src={img} width={"35%"} alt={"기본 이미지"}></img>
              </div>
              <BtnGroup>
                <BtnBox>
                  <CustomButton
                    onClick={() => navigate("/interview/practice-choice-stack")}
                  >
                    연습 면접 모드
                  </CustomButton>
                  <InfoText># 무한모드 #1문제씩_정답_확인가능</InfoText>
                </BtnBox>
                <BtnBox>
                  <CustomButton
                    onClick={() => navigate("/interview/choice-stack")}
                  >
                    실전 면접 모드
                  </CustomButton>
                  <InfoText># 10개씩 #한번에_정답_확인가능</InfoText>
                </BtnBox>
              </BtnGroup>
            </GlassCard>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default InterviewMain;

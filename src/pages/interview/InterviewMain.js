import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import palette from "../../styles/pallete";
import styled from "styled-components";
import img from "../../assets/default.png";
import Wrapper from "../../components/Wrapper";
import GlassCard from "../../components/GlassCard";
import Block from "../../components/Block";
import CustomButton from "../../components/CustomButton";

const Title = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const TitleTextGroup = styled.div``;

const BtnGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 4vh 8vw;
`;

const BtnBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 50px;
  margin-right: 50px;
`;

const MyBtn = styled.button`
  background-color: ${(props) => props.color};
  border: none;
  width: 300px;
  height: 100px;
  border-radius: 20px;
  font-size: 30px;
  font-weight: bold;
  color: white;
  backdrop-filter: blur(10px);
`;

const InfoText = styled.div`
  margin-top: 10px;
  font-size: 20px;
  color: #a4a4a4;
`;

const TitleText = styled.div`
  font-size: 3rem;
  font-weight: bold;
`;

const SubTitleText = styled.div`
  margin-top: 40px;
  font-size: 1rem;
  font-weight: bold;
`;

const DescriptionText = styled.div`
  margin-top: 10px;
  font-size: 20px;
  color: #a4a4a4;
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
            <GlassCard>
              <div style={{ margin: "10px 30px" }}>
                <Title>
                  <TitleTextGroup>
                    <TitleText>면접 시뮬레이션</TitleText>
                    <SubTitleText>
                      CS 면접, 잘 준비 되셨나요?
                      <br />
                      아는 만큼 대답해주세요!
                      <br />
                      <br />
                      GPT가 면접 답변을 평가해줘요!
                    </SubTitleText>
                    <DescriptionText>
                      기능 사용을 위해서는 Open AI API키가 필요합니다.
                      <br />
                      <br />
                      API키 생성 방법
                    </DescriptionText>
                  </TitleTextGroup>
                  <img src={img} width={"20%"} alt={"기본 이미지"}></img>
                </Title>
              </div>
              <BtnGroup>
                <BtnBox>
                  <CustomButton
                    onClick={() => navigate("/interview/practice-choice-stack")}
                  >
                    연습 선택 스택
                  </CustomButton>
                  <InfoText># 무한모드 #1문제씩_정답_확인가능</InfoText>
                </BtnBox>
                <BtnBox>
                  <CustomButton
                    onClick={() => navigate("/interview/choice-stack")}
                  >
                    면접 선택 스택
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

import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components';
import Header from "../../components/Header";
import img from "../../assets/note.png";
import CustomButton from "../../components/CustomButton";
import { useLocation, useNavigate } from "react-router-dom";
import pallete from "../../styles/pallete";
import Wrapper from '../../components/Wrapper';
import GlassCard from '../../components/GlassCard';
import palette from '../../styles/pallete';
import Block from '../../components/Block';


const SubTitleText = styled.div`
  margin-top: 40px;
  font-size: 0.8em;
  font-weight: bold;
`;

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


const InterviewNote = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const answers = location.state || {};

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <Header />
      <Wrapper>
        <div style={{ margin: "auto 0" }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Block></Block>
            <GlassCard width={"60vw"}>
              <div
                style={{
                  height: "20vh",
                  margin: "40px 8vw",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h1>면접 결과</h1>
                  <SubTitleText>
                    <h1>면접 잘 보셨나요?</h1>
                  </SubTitleText>
                </div>
                <img src={img} width={"18%"} alt={"기본 이미지"} style={{ marginRight: '30px' }}></img>
              </div>
              <BtnGroup>
                <BtnBox>
                  <CustomButton onClick={() => navigate('/interview/main')}>
                    재도전
                  </CustomButton>
                </BtnBox>
                <BtnBox>
                  <CustomButton onClick={() => navigate('/interview/note')}>
                    오답노트
                  </CustomButton>
                </BtnBox>

              </BtnGroup>
            </GlassCard>
            {answers.length > 0 ? answers.map((answer, index) => (
              <Accordion
                sx={{
                  '&:before': { display: 'none' },
                  marginBottom: 2,
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '10px'
                }}
                key={index}
                expanded={expanded === index}
                onChange={handleAccordionChange(index)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{index + 1}. {answer.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <GlassCard width={"58vw"} padding={2} sx={{ flex: 1 }}>
                    <Typography variant="h5" gutterBottom>나의 답변</Typography>
                    <Typography>{answer.memberAnswer}</Typography>
                  </GlassCard>
                  <GlassCard width={"58vw"} padding={2} sx={{ flex: 1 }}>
                    <Typography variant="h5" gutterBottom>GPT의 답변</Typography>
                    <Typography>{answer.gptAnswer}</Typography>
                  </GlassCard>
                </AccordionDetails>
              </Accordion>
            ))
              :
              '답변한 내역이 없습니다.'}
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default InterviewNote;

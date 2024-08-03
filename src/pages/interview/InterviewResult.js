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
import img from "../../assets/default.png";
import CustomButton from "../../components/CustomButton";
import { useLocation, useNavigate } from "react-router-dom";
import pallete from "../../styles/pallete";
import Wrapper from '../../components/Wrapper';
import GlassCard from '../../components/GlassCard';


const TitleContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 1200px;
    margin: 50px auto;
    padding: 0 20px;
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
    <>
      <Header />
      <Wrapper>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TitleContainer>
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: '20px'
            }}>
              <div>
                <Typography variant="h2" marginBottom={10}>
                  면접 결과
                </Typography>
                <Typography variant="h5">
                  과연 당신은 면접을 잘 봤을까요? <br />
                  GPT는 아니라고 하던데,,,
                </Typography>
              </div>
              <img src={img} width={'40%'} alt={'기본 이미지'} />
            </div>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
              <CustomButton sx={{ marginTop: 2 }} onClick={() => navigate('/interview/main')}>재도전</CustomButton>
              <CustomButton sx={{ marginTop: 2 }} onClick={() => navigate('/interview/note')}>오답노트</CustomButton>
            </div>
          </TitleContainer>
          <GlassCard>
            {answers.length > 0 ? answers.map((answer, index) => (
              <Accordion
                sx={{
                  '&:before': { display: 'none' },
                  marginBottom: 2,
                  color: 'darkslategray',
                  backgroundColor: '#F0F0F0',
                  borderRadius: '0.6rem',
                  boxShadow: 'none',
                  maxWidth: '1200px'
                }}
                key={index}
                expanded={expanded === index}
                onChange={handleAccordionChange(index)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{index + 1}. {answer.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <GlassCard sx={{ display: 'flex', backgroundColor: pallete.pink, borderRadius: '20px', marginBottom: '20px' }}>
                    <GlassCard padding={2} sx={{ flex: 1 }}>
                      <Typography variant="h5" gutterBottom>나의 답변</Typography>
                      <Typography>{answer.memberAnswer}</Typography>
                    </GlassCard>
                    <GlassCard padding={2} sx={{ flex: 1 }}>
                      <Typography variant="h5" gutterBottom>GPT의 답변</Typography>
                      <Typography>{answer.gptAnswer}</Typography>
                    </GlassCard>
                  </GlassCard>
                </AccordionDetails>
              </Accordion>
            ))
              :
              '답변한 내역이 없습니다.'}
          </GlassCard>
        </div>

      </Wrapper>
    </>
  );
};

export default InterviewNote;

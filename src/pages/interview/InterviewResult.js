import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components';
import Header from "../../components/Header";
import img from "../../assets/default.png";
import CustomButton from "../../components/CustomButton";
import {useLocation, useNavigate} from "react-router-dom";
import pallete from "../../styles/pallete";


const TitleContainer = styled(Box)`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: center;
    max-width: 1200px;
    margin: 50px auto;
    padding: 0 20px;
`;

const CenteredBox = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
`;


const InterviewNote = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const answers = location.state || {};

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (answers.length === 0) {
    return <CenteredBox><CircularProgress /></CenteredBox>;
  }

  return (
    <div>

      <Header sx={{ margin: 0 }} /> {/* Remove extra margin from Header */}
      <div style={{display:'flex',flexDirection:'column', alignItems:'center'}}>
        <TitleContainer>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start'}}>
            <Typography variant="h2" marginBottom={10}>
              면접 결과
            </Typography>
            <Typography variant="h5">
              과연 당신은 면접을 잘 봤을까요? <br />
              GPT는 아니라고 하던데,,,
            </Typography>
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end' }}>
            <img src={img} width={'40%'} alt={'기본 이미지'} />
            <Box sx={{ flexDirection: 'column', justifyContent: 'flex-end'}}>
              <CustomButton sx={{ marginTop: 2 }} onClick={() => navigate('/interview/choice-mode')}>재도전</CustomButton>
              <CustomButton sx={{ marginTop: 2 }} onClick={() => navigate('/interview/note')}>오답노트</CustomButton>
            </Box>
          </Box>
        </TitleContainer>

        <CenteredBox sx={{ flexDirection: 'column', marginTop: 2, alignItems: 'center'}}>
          {answers.map((answer, index) => (
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
                <Typography variant="h6">{answer.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', backgroundColor: pallete.pink, borderRadius: '20px', marginBottom: '20px' }}>
                  <Box padding={2} sx={{ flex: 1 }}>
                    <Typography variant="h5" gutterBottom>나의 답변</Typography>
                    <Typography>{answer.memberAnswer}</Typography>
                  </Box>
                  <Box padding={2} sx={{ flex: 1 }}>
                    <Typography variant="h5" gutterBottom>GPT의 답변</Typography>
                    <Typography>{answer.gptAnswer}</Typography>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </CenteredBox>
      </div>
      </div>
  );
};

export default InterviewNote;

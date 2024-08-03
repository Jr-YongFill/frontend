import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  Box,
  Grid,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import img from "../../assets/default.png";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import CustomButton from "../../components/CustomButton";
import { palette } from "@mui/system";
import { baseAPI } from "../../config";
import { localStorageGetValue } from "../../utils/CryptoUtils";
import Wrapper from '../../components/Wrapper';
import GlassCard from '../../components/GlassCard';
import GlassModal from '../../components/modal/GlassModal';

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
  const memberId = localStorageGetValue('member-id');;
  const [stacks, setStacks] = useState([]);
  const [selectedStack, setSelectedStack] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalOnClick, setModalOnClick] = useState(null);

  // 스택 데이터 가져오기
  useEffect(() => {
    const fetchStacks = async () => {
      try {
        const response = await baseAPI.get(`http://localhost:8080/api/members/${memberId}/stacks`);
        setStacks(response.data.filter(stack => stack.isPurchase));
        if (response.data.length > 0) {
          setSelectedStack(response.data[0].id); // 기본적으로 첫 번째 스택 선택
        }
      } catch (error) {

        setModalText(error.response.data.message);
        setModalOnClick(() => () => {
          setIsModalOpen(false);
        })
        setIsModalOpen(true);
      }
    };

    fetchStacks();
  }, []);

  // 질문 데이터 가져오기
  useEffect(() => {
    if (selectedStack === null) return;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await baseAPI.get(`http://localhost:8080/api/members/${memberId}/stacks/${selectedStack}/answers?page=${currentPage - 1}&size=6`);
        setQuestions(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        setModalText(error.response.data.message);
        setModalOnClick(() => () => {
          setIsModalOpen(false);
        })
        setIsModalOpen(true);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedStack, currentPage, memberId]);

  if (loading) return <CenteredBox><CircularProgress /></CenteredBox>;
  if (error) return <CenteredBox><Alert severity="error">Error loading data!</Alert></CenteredBox>;

  const handleChangeTab = (event, newValue) => {
    setSelectedStack(newValue);
    setCurrentPage(1); // 페이지를 초기화합니다
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Header sx={{ margin: 0 }} /> {/* Remove extra margin from Header */}
      <Wrapper>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <TitleContainer>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start'
            }}>
              <Typography variant="h2" marginBottom={10}>
                오답노트
              </Typography>
              <Typography variant="h5">
                당신의 대답은 이러한데... 과연 잘한걸까요...? <br />
                다시 한 번 확인해보세요!
              </Typography>
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'end'
            }}>
              <img src={img} width={'40%'} alt={'기본 이미지'} />
              <CustomButton sx={{ marginTop: 2 }} onClick={() => navigate('/interview/choice-stack')}>면접 보러 가기</CustomButton>
            </Box>
          </TitleContainer>
          <GlassCard>
            <Box sx={{ width: '100%', maxWidth: 1200, marginTop: 2 }}>
              <CenteredBox>
                <Tabs
                  value={selectedStack}
                  onChange={handleChangeTab}
                  aria-label="stack tabs"
                  sx={{ marginBottom: 2 }}
                >
                  {stacks.map((stack) => (
                    <Tab key={stack.id} label={stack.stackName} value={stack.id} />
                  ))}
                </Tabs>
              </CenteredBox>
            </Box>

            <CenteredBox sx={{ flexDirection: 'column', width: '100%' }}>
              {questions.map((question) => (
                <Accordion
                  sx={{
                    '&:before': {
                      display: 'none',
                    },
                    width: '60%',
                    marginBottom: 2,
                    color: 'darkslategray',
                    backgroundColor: '#F0F0F0',
                    borderRadius: '0.6rem',
                    boxShadow: 'none'
                  }}
                  key={question.id}
                  expanded={expanded === question.id}
                  onChange={handleAccordionChange(question.id)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{question.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {question.memberAnswers[0].id ? (
                      question.memberAnswers.map((answer) => (
                        <Box key={answer.id} sx={{ marginBottom: 2 }}>
                          <Grid container spacing={2} sx={{
                            marginTop: '10px',
                            marginBottom: '10px',
                            marginLeft: '20px',
                            alignItems: 'bottom'
                          }}
                          >
                            <Typography variant="h4" gutterBottom>
                              {answer.createDate ? new Date(answer.createDate).toLocaleDateString() : 'No Date'}&nbsp;&nbsp;
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{
                              display: 'flex',
                              // fontWeight: 'bold',
                              color: answer.interviewMode === "PRACTICE" ? 'darkblue' : 'burgundy',
                              marginTop: '8px'
                            }}
                            >
                              {answer.interviewMode === "PRACTICE" ? '연습 문제' : '실전 문제'}
                            </Typography>
                          </Grid>
                          <Box sx={{
                            display: 'flex',
                            backgroundColor: answer.interviewMode === "PRACTICE" ? '#EAFAFF' : '#FFF1F4',
                            borderRadius: '20px',
                            marginBottom: '50px'
                          }}
                          >
                            <Grid container >
                              <Grid item xs={6}>
                                <Box padding={4}>
                                  <Typography variant="h5" gutterBottom>
                                    나의 답변
                                  </Typography>
                                  <Typography sx={{ wordWrap: "break-word" }}>{answer.memberAnswer}</Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box padding={4}>
                                  <Typography variant="h5" gutterBottom>
                                    GPT의 답변
                                  </Typography>
                                  <Typography sx={{ wordWrap: "break-word" }}>{answer.gptAnswer}</Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="h5" gutterBottom>답변이 존재하지 않습니다.<br />면접을 더 진행해보세요!</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
              <CenteredBox sx={{ marginTop: 2 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handleChangePage}
                  color={palette.skyblue}
                />
              </CenteredBox>
            </CenteredBox>
          </GlassCard>
        </div>
      </Wrapper>


      <GlassModal
        isModalOpen={isModalOpen}
        setIsModalOpen={() => setIsModalOpen(false)}
        message={modalText}
        onClick={modalOnClick} />
    </>
  );
};

export default InterviewNote;
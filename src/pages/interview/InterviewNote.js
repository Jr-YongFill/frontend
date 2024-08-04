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
import img from "../../assets/note.png";
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
import Block from '../../components/Block';


const CenteredBox = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
`;


const SubTitleText = styled.div`
  margin-top: 40px;
  font-size: 0.8em;
  font-weight: bold;
`;

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#635ee7',
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      color: '#6854fc !important',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  }),
);


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
        const response = await baseAPI.get(`/api/members/${memberId}/stacks`);
        const datas = response.data;
        setStacks(datas);
        const purchasedFirstStackId = datas.filter(stack=>stack.isPurchase)[0].id

        if (datas.length > 0) {
          setSelectedStack(purchasedFirstStackId); // 구매한 스택 기준 첫 번째 스택 선택
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
        const response = await baseAPI.get(`/api/members/${memberId}/stacks/${selectedStack}/answers?page=${currentPage - 1}&size=6`);
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
          <Block></Block>
          <GlassCard width={"60vw"}>
            <div
              style={{
                height: "35vh",
                margin: "40px 8vw",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >

              <div >
                <h1>오답노트</h1>
                <SubTitleText>
                  <p>내가 뭐라 답했더라?</p>
                  <p>다시 한 번 복습해봐요!</p>
                </SubTitleText>
              </div>
              <img src={img} width={"18%"} alt={"기본 이미지"} style={{ marginRight: '30px' }}></img>
            </div>

          </GlassCard>

          <GlassCard>
            <Box sx={{ width: '60vw', maxWidth: 1200, marginTop: 2 }}>
              <CenteredBox>
                <StyledTabs
                  value={selectedStack}
                  onChange={handleChangeTab}
                  aria-label="stack tabs"
                  sx={{
                    marginBottom: 2
                  }}
                >
                  {stacks.map((stack) => (
                    stack.isPurchase ? (
                      <StyledTab key={stack.id} label={stack.stackName} value={stack.id} />

                    ) : (
                      <Tab key={stack.id} label={stack.stackName} value={stack.id} disabled />
                    )
                  ))}
                </StyledTabs>
              </CenteredBox>
            </Box>

            <CenteredBox sx={{ flexDirection: 'column', width: '60vw' }}>
              {questions.map((question) => (
                <Accordion
                  sx={{
                    '&:before': {
                      display: 'none',
                    },
                    width: '80%',
                    marginBottom: 2,
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.6rem',
                    boxShadow: 'none'
                  }}
                  key={question.id}
                  expanded={expanded === question.id}
                  onChange={handleAccordionChange(question.id)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <Typography variant="h6">{question.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }}>
                    {question.memberAnswers[0].id ? (
                      question.memberAnswers.map((answer) => (
                        <GlassCard key={answer.id} style={{ marginBottom: 2 }}>
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
                          <GlassCard>
                            <GlassCard>
                              <Typography variant="h5" gutterBottom>
                                나의 답변
                              </Typography>
                              <Typography sx={{ wordWrap: "break-word" }}>{answer.memberAnswer}</Typography>
                            </GlassCard>
                            <GlassCard>
                              <Typography variant="h5" gutterBottom>
                                GPT의 답변
                              </Typography>
                              <Typography sx={{ wordWrap: "break-word" }}>{answer.gptAnswer}</Typography>
                            </GlassCard>
                          </GlassCard>
                        </GlassCard>
                      ))
                    ) : (
                      <div style={{ fontSize: '0.9em' }}>
                        답변이 존재하지 않습니다.<br />면접을 더 진행해보세요!
                      </div>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
              <CenteredBox sx={{ marginTop: 2 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handleChangePage}
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
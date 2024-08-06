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
  PaginationItem,
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
import NPGlassCard from "../../components/NoPaddingGlassCard";
import GlassTitle from "../../components/GlassTitle";


const CenteredBox = styled(Box)`
    display: flex;
    justify-content: center;
    //align-items: center;
`;

const SubContainer = styled.div` 
  //width: 90%;
  //padding: 3vh 3vh;
  margin: 3vh 3vh;
  display: flex;
  flex-direction:column;
  //justify-content: center;
  //align-items: center;
  //text-align: center;
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
    color: 'white !important',
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
        const purchasedFirstStackId = datas.filter(stack => stack.isPurchase)[0].id

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
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ height: '3rem' }} />
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

              <div>
                <h1>오답노트</h1>
                <SubTitleText>
                  <p>내가 뭐라 답했더라?</p>
                  <p>다시 한 번 복습해봐요!</p>
                </SubTitleText>
                <div style={{color:'gray',fontWeight:'normal'}}>
                    무응답 후 제출할 경우 음성인식이 올바르지 않을 수 있어요
                </div>

              </div>
              <img src={img} width={"30%"} alt={"기본 이미지"} style={{ marginRight: '30px' }}></img>
            </div>

          </GlassCard>

          <Box sx={{ marginTop: 2 }}>
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
          </Box>

          <div style={{ width: '62vw' }}>
            {questions.map((question) => (
              <Accordion
                sx={{
                  '&:before': { display: 'none' },
                  '& .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root': { color: 'white' },
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  marginBottom: '1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
                key={question.id}
                expanded={expanded === question.id}
                onChange={handleAccordionChange(question.id)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    justifyContents: 'center'
                  }}
                >
                  <Typography variant="h6">{question.question}</Typography>
                  {question.memberAnswers[0].id ? 
                    <Typography variant={"body2"} sx={{marginLeft:'auto', marginRight:'2vw', marginTop:'0.3vw'}}>답변 {question.memberAnswers.length}개</Typography> :
                    <Typography variant={"body2"} sx={{marginLeft:'auto', marginRight:'2vw', marginTop:'0.3vw'}} color={'gray'}>답변 없음</Typography>
                  }
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }}>
                  {question.memberAnswers[0].id ? (
                    question.memberAnswers.map((answer) => (
                      <div key={answer.id} style={{ margin: '3rem' }}>
                        <Typography variant="h4" gutterBottom>
                          {answer.createDate ? new Date(answer.createDate).toLocaleDateString() : 'No Date'}&nbsp;&nbsp;
                        </Typography>
                        <Typography variant="h6" gutterBottom sx={{
                          display: 'flex',
                          // fontWeight: 'bold',
                          color: answer.interviewMode === "PRACTICE" ? 'lightblue' : 'pink',
                          marginTop: '8px'
                        }}
                        >
                          {answer.interviewMode === "PRACTICE" ? '연습 문제' : '실전 문제'}
                        </Typography>
                        <div>

                          <NPGlassCard>
                            <GlassTitle>
                              <div style={{ fontSize: 25, fontWeight: 'bold' }}>나의 답변</div>
                            </GlassTitle>
                            <SubContainer>
                              <div style={{ paddingBottom: '3vh' }}>{answer.memberAnswer}</div>
                            </SubContainer>
                          </NPGlassCard>

                          <NPGlassCard>
                            <GlassTitle>
                              <div style={{ fontSize: 25, fontWeight: 'bold' }}>GPT의 답변</div>
                            </GlassTitle>
                            <SubContainer>
                              <div style={{ paddingBottom: '3vh', wordWrap: "break-word" }}>{answer.gptAnswer}</div>
                            </SubContainer>
                          </NPGlassCard>
                        </div>
                      </div>
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
                variant="outlined"
                shape="rounded"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: 'none', 
                  },
                  '& .MuiPaginationItem-previousNext': {
                    color: 'white',
                  },
                  '& .MuiPaginationItem-outlined': {
                    border: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              />
            </CenteredBox>
          </div>
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
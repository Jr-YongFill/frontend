import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styled from 'styled-components';
import palette from '../../styles/pallete';
import CustomLi from '../../components/CustomLi';
import CustomButton from '../../components/CustomButton';
import { baseAPI } from '../../config';
import { localStorageGetValue } from '../../utils/CryptoUtils';
import Wrapper from '../../components/Wrapper';
import GlassCard from '../../components/GlassCard';
import Block from '../../components/Block';
import NPGlassCard from '../../components/NoPaddingGlassCard';
import GlassTitle from '../../components/GlassTitle';

const ContainerWrapper = styled.div`
  width:60vw;

`

const ContainerRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap:3vw;
`;

const SubContainer = styled.div`
  width: 100%;
  padding: 5vh 0px;
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const CommunityMain = () => {


  const navigate = useNavigate();
  const [qnaData, setQNAData] = useState([]);
  const [infoData, setInfoData] = useState([]);
  const [count, setCount] = useState(0);
  const [question, setQuestion] = useState("");

  const memberId = localStorageGetValue("member-id");
  const navigateHandler = (url) => () => {
    navigate(url);
  };

  useEffect(() => {

    const fetcQNAData = async () => {
      try {
        const qnaResponse = await baseAPI.get(`/api/categories/QNA/posts?page=0&size=5`);
        setQNAData(qnaResponse.data.resultList);
      } catch (error) {
        // console.error('카테고리 정보 로딩 실패', error);
      }
    };


    const fetcInfoData = async () => {
      try {
        const infoResponse = await baseAPI.get(`/api/categories/INFO/posts?page=0&size=5`);
        setInfoData(infoResponse.data.resultList);
      } catch (error) {
        // console.error('카테고리 정보 로딩 실패', error);
      }
    };

    const fetchCount = async () => {
      try {
        if (memberId != null) {
          const response = await baseAPI.get(`/api/members/${memberId}/answers`);
          setCount(response.data.count);
        }
        // 
      } catch (error) {
        // console.error('Error fetching data', error);
      }
    };

    const fetchQuestion = async () => {
      console.log("바보야!0");
      console.log(localStorageGetValue('member-id'));
      try {
        if (localStorageGetValue('member-id')) {
          const response = await baseAPI.get('/api/votes');
          const resultList = response.data.pageResponseDTO.resultList;

          if (resultList && resultList.length > 0) {
            setQuestion(resultList[0]);
          }
        }
      } catch (error) {
        // console.error('Error fetching data', error);
      }
    };

    fetcQNAData();
    fetcInfoData();
    fetchCount();
    fetchQuestion();
  }, [memberId]);

  const HandleVote = () => {
    if (memberId) {
      navigate("/vote");
    } else {
      alert('로그인 후 이용 가능합니다.');
      navigate("/auth/sign-in");
    }
  }

  const HandleInterview = () => {
    if (memberId) {
      navigate("/vote");
    } else {
      alert('로그인 후 이용 가능합니다.');
      navigate("/auth/sign-in");
    }
  }

  return (
    <div>
      <Header />
      <Wrapper>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Block></Block>
          <ContainerWrapper>
            <ContainerRow>
              <NPGlassCard>
                <GlassTitle>
                  <div style={{ fontSize: 25, fontWeight: 'bold' }}>오늘의 면접</div>
                </GlassTitle>
                    {count === 0 ? (
                      <SubContainer>
                        <div style={{ paddingBottom: '3vh' }}>오늘 면접 본 기록이 없어요!</div>
                        <CustomButton onClick={HandleInterview}>
                          면접 보러 가기
                        </CustomButton>
                      </SubContainer>

                    ) : (
                      <SubContainer>
                        <div style={{ paddingBottom: '3vh'}}>오늘 {count} 개 질문에 답했네요!</div>
                        <CustomButton onClick={navigateHandler("/interview/choice-mode")}>
                          오답노트 보기
                        </CustomButton>
                      </SubContainer>
                    )}
              </NPGlassCard>
              <NPGlassCard>
                <GlassTitle>
                  <div style={{ fontSize: 25, fontWeight: 'bold' }}>CS 투표</div>
                </GlassTitle>
                  {question === "" ? (
                    <>
                  <SubContainer>  
                      <div style={{  paddingBottom: '3vh'}}>새로 질문을 등록하고 크레딧을 받아봐요!</div>
                      <CustomButton onClick={HandleVote}>
                        질문 등록 하기
                      </CustomButton>
                    </SubContainer></>
                  ) : (
                    <>
                    <SubContainer>
                      <div style={{  paddingBottom: '3vh'}}>{question.question}</div>
                      <CustomButton onClick={HandleVote}>
                        투표하러 가기
                      </CustomButton>
                    </SubContainer>
                    </>
                  )}
              </NPGlassCard>
            </ContainerRow>
            <ContainerRow>
              <NPGlassCard>
                <GlassTitle>
                  <div
                    style={{ fontSize: 25, fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={navigateHandler("/community/qna")}>Q & A</div>
                    <a href='/community/qna' style={{color:palette.gray, textDecorationLine : 'none'}}>+ 더보기</a>
                </GlassTitle>
                <ul style={{padding: '3vh 0', margin: '0 3vw'}}>
                  {qnaData ?
                    (qnaData.map((data, idx) => {
                      return (
                        <CustomLi key={idx} data={data}></CustomLi>
                      )
                    }))
                    :
                    (<div>게시글이 없네요!</div>)
                  }
                </ul>
              </NPGlassCard>
              <NPGlassCard>
                <GlassTitle>
                  <div
                    style={{ fontSize: 25, fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={navigateHandler("/community/info")}>정보 공유</div>
                    <a href='/community/info' style={{color:palette.gray, textDecorationLine : 'none'}}>+ 더보기</a>
                </GlassTitle>
                <ul style={{ padding: '3vh 0', margin: '0 3vw' }}>
                  {infoData ?
                    (infoData.map((data, idx) => {
                      return (
                        <CustomLi key={idx} data={data}></CustomLi>
                      )
                    }))
                    :
                    (<div>게시글이 없네요!</div>)
                  }
                </ul>
              </NPGlassCard>
            </ContainerRow>
          </ContainerWrapper>
        </div>
      </Wrapper>
    </div >
  );
};

export default CommunityMain;

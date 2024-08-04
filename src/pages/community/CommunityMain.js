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
import Block from '../../components/Block';
import NPGlassCard from '../../components/NoPaddingGlassCard';
import GlassTitle from '../../components/GlassTitle';
import GlassModal from "../../components/modal/GlassModal";

const ContainerWrapper = styled.div`
  width:60vw;

`

const ContainerRow = styled.div`
  display: flex;
  justify-content: space-between;
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalOnClick, setModalOnClick] = useState(null);

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
        setModalText(error.response.data.message);
        setModalOnClick(() => () => {
          setIsModalOpen(false);
          window.location.href = '/';
        })
        setIsModalOpen(true);
      }
    };


    const fetcInfoData = async () => {
      try {
        const infoResponse = await baseAPI.get(`/api/categories/INFO/posts?page=0&size=5`);
        setInfoData(infoResponse.data.resultList);
      } catch (error) {
        setModalText(error.response.data.message);
        setModalOnClick(() => () => {
          setIsModalOpen(false);
          window.location.href = '/';
        })
        setIsModalOpen(true);
      }
    };

    const fetchCount = async () => {
      try {
        if (memberId != null) {
          const response = await baseAPI.get(`/api/members/${memberId}/answers`);
          setCount(response.data.count);
        }
      } catch (error) {
        setModalText(error.response.data.message);
        setModalOnClick(() => () => {
          setIsModalOpen(false);
        })
        setIsModalOpen(true);
      }
    };

    const fetchQuestion = async () => {
      try {
        if (memberId != null) {
          const response = await baseAPI.get('/api/votes');
          const resultList = response.data.pageResponseDTO.resultList;

          if (resultList && resultList.length > 0) {
            setQuestion(resultList[0]);
          }
        }
      } catch (error) {
        setModalText(error.response.data.message);
        setModalOnClick(() => () => {
          setIsModalOpen(false);
        })
        setIsModalOpen(true);
      }
    };

    fetcQNAData();
    fetcInfoData();
    fetchCount();
    fetchQuestion();
  }, [memberId]);


  const HandlePage = (path) => {
    if (memberId) {
      navigate(path);
    } else {
      setModalText('로그인이 필요한 페이지 입니다.');
      setModalOnClick(() => () => {
        setIsModalOpen(false);
        navigate('/auth/sign-in');
      })
      setIsModalOpen(true);
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
              <div  style={{width:'29.5vw'}}>
              <NPGlassCard>
                <GlassTitle>
                  <div style={{ fontSize: 25, fontWeight: 'bold' }}>오늘의 면접</div>
                </GlassTitle>
                {count === 0 ? (
                  <SubContainer>
                    <div style={{ paddingBottom: '3vh' }}>오늘 면접 본 기록이 없어요!</div>
                    <CustomButton onClick={() => HandlePage("/interview/main")}>
                      면접 보러 가기
                    </CustomButton>
                  </SubContainer>

                ) : (
                  <SubContainer>
                    <div style={{ paddingBottom: '3vh' }}>오늘 {count} 개 질문에 답했네요!</div>
                    <CustomButton onClick={() => HandlePage("/interview/note")}>
                      오답노트 보기
                    </CustomButton>
                  </SubContainer>
                )}
                
              </NPGlassCard>
              </div>
              <div  style={{width:'29.5vw'}}>
              <NPGlassCard>
             
                <GlassTitle>
                  <div style={{ fontSize: 25, fontWeight: 'bold' }}>CS 투표</div>
                </GlassTitle>
                {question === "" ? (
                  <>
                    <SubContainer>
                      <div style={{ paddingBottom: '3vh' }}>새로 질문을 등록하고 크레딧을 받아봐요!</div>
                      <CustomButton onClick={() => HandlePage('/vote')}>
                        질문 등록 하기
                      </CustomButton>
                    </SubContainer></>
                ) : (
                  <>
                    <SubContainer>
                      <div style={{ paddingBottom: '3vh' }}>{question.question}</div>
                      <CustomButton onClick={() => HandlePage('/vote')}>
                        투표하러 가기
                      </CustomButton>
                    </SubContainer>
                  </>
                )}
              </NPGlassCard>
              </div>
            </ContainerRow>
            <ContainerRow>
              <div style={{width:'29.5vw'}}>
              <NPGlassCard>
                <GlassTitle>
                  <div
                    style={{ fontSize: 25, fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={navigateHandler("/community/qna")}>Q & A</div>
                  <a href='/community/qna' style={{ color: palette.gray, textDecorationLine: 'none' }}>+ 더보기</a>
                </GlassTitle>
                <ul style={{ padding: '3vh 0', margin: '0 3vw' }}>
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
              </div>
              <div style={{width:'29.5vw'}} >
              <NPGlassCard>
                <GlassTitle>
                  <div
                    style={{ fontSize: 25, fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={navigateHandler("/community/info")}>정보 공유</div>
                  <a href='/community/info' style={{ color: palette.gray, textDecorationLine: 'none' }}>+ 더보기</a>
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
              </div>
            </ContainerRow>
          </ContainerWrapper>
        </div>
      </Wrapper>
      <GlassModal
        isModalOpen={isModalOpen}
        setIsModalOpen={() => setIsModalOpen(false)}
        message={modalText}
        onClick={modalOnClick} />
    </div >
  );
};

export default CommunityMain;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styled from 'styled-components';
import palette from '../../styles/pallete';
import CustomLi from '../../components/CustomLi';
import CustomButton from '../../components/CustomButton';
import { baseAPI } from '../../config';
import { localStorageGetValue } from '../../utils/CryptoUtils';

const Wrapper = styled.div`
  display: flex;
  margin: 10px;
  justify-content: center;
  align-content: center;  
`;

const ContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;  
`;

const ContainerRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Container = styled.div`
  background: white;
  width: 35vw;
  margin: 5px 5px 0px 5px;
  height: 38vh;
`;

const HighLight = styled.div`
  background: ${palette.skyblue};
  width: 150px;
  height: 8px;
  margin-top: 3px;
`;

const SubContainer = styled.div`
  margin-right: 30px;
  background: white;
  width: 100%;
  height: 30vh;
  margin-top: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-left: -4vw;
`;

const CommunityMain = () => {


  const navigate = useNavigate();
  const [qnaData, setQNAData] = useState([]);
  const [infoData, setInfoData] = useState([]);
  const [count, setCount] = useState(0);
  const [question, setQuestion] = useState("");

  const memberId =  localStorageGetValue("member-id");
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
        if(memberId!=null){
          const response = await baseAPI.get(`/api/members/${memberId}/answers`);
          setCount(response.data.count);
        }
        // 
      } catch (error) {
        // console.error('Error fetching data', error);
      }
    };

    const fetchQuestion = async () => {
      try {
        const response = await baseAPI.get('/api/votes');
        const resultList = response.data.pageResponseDTO.resultList;

        if (resultList && resultList.length > 0) {
          setQuestion(resultList[0]);
        } else {
          setQuestion("");
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

  return (
    <div>
      <Header />
      <Wrapper>
        <ContainerWrapper>
          <ContainerRow>
            <Container>
              <div style={{ fontSize: 25, fontWeight: 'bold' }}>오늘의 면접</div>
              <HighLight />
              <SubContainer>
                {count === 0 ? (
                  <div>
                    <div style={{ marginBottom: '-3vh' }}>오늘 면접 본 기록이 없어요!</div>
                    <CustomButton color={palette.skyblue} onClick={navigateHandler("/interview/main")}>
                      면접 보러 가기
                    </CustomButton>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: '-3vh' }}>오늘 {count} 개 질문에 답했네요!</div>
                    <CustomButton color={palette.skyblue} onClick={navigateHandler("/interview/choice-mode")}>
                      오답노트 보기
                    </CustomButton>
                  </div>
                )}
              </SubContainer>
            </Container>
            <Container>
              <div style={{ fontSize: 25, fontWeight: 'bold' }}>CS 투표</div>
              <HighLight />
              <SubContainer>
                {question === "" ? (
                  <div>
                    <div style={{ marginBottom: '-3vh' }}>새로 질문을 등록하고 크레딧을 받아봐요!</div>
                    <CustomButton color={palette.skyblue} onClick={navigateHandler("/vote")}>
                      질문 등록 하기
                    </CustomButton>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: '-3vh' }}>{question.question}</div>
                    <CustomButton color={palette.skyblue} onClick={navigateHandler("/vote")}>
                      투표하러 가기
                    </CustomButton>
                  </div>
                )}
              </SubContainer>
            </Container>
          </ContainerRow>
          <ContainerRow>
            <Container>
              <div
                style={{ fontSize: 25, fontWeight: 'bold', cursor:'pointer'}}
                onClick={navigateHandler("/community/qna")}>Q & A</div>
              <HighLight />
              <ul style={{ padding: 0, marginLeft: 0, marginRight: '8vw' }}>
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
            </Container>
            <Container>
              <div
                style={{ fontSize: 25, fontWeight: 'bold' ,cursor:'pointer' }}
                onClick={navigateHandler("/community/info")}>정보 공유</div>
              <HighLight />
              <ul style={{ padding: 0, marginLeft: 0, marginRight: '8vw' }}>
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
            </Container>
          </ContainerRow>
        </ContainerWrapper>
      </Wrapper>
    </div >
  );
};

export default CommunityMain;

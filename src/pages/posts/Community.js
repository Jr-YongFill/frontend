import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styled from 'styled-components';
import palette from '../../styles/pallete';
import axios from 'axios';
import CustomLi from '../../components/CustomLi';
import CustomButton from '../../components/CustomButton';
import { baseAPI } from '../../config';

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

const Community = () => {

  const API_URL = process.env.REACT_APP_API_URI;

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [question, setQuestion] = useState("");

  const navigateHandler = (url) => () => {
    navigate(url);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await baseAPI.get('/api/categories/posts');
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('카테고리 정보 로딩 실패', error);
      }
    };
    fetchData();

    const fetchCount = async () => {
      try {
        // TODO: localStorage에서 멤버 id 가져오기
        const response = await baseAPI.get('/api/members/1/answers');
        setCount(response.data.count);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchCount();

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
        console.error('Error fetching data', error);
      }
    };

    fetchQuestion();
  }, []);

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
                    <CustomButton color={palette.skyblue} onClick={navigateHandler("/interview/choice-mode")}>
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
                    <div style={{ marginBottom: '-3vh' }}>{question}</div>
                    <CustomButton color={palette.skyblue} onClick={navigateHandler("/vote")}>
                      투표하러 가기
                    </CustomButton>
                  </div>
                )}
              </SubContainer>
            </Container>
          </ContainerRow>
          <ContainerRow>
          {data.map((category, categoryIndex) => (
            <Container key={categoryIndex}>
              <div style={{ fontSize: 25, fontWeight: 'bold' }}>{category.category}</div>
              <HighLight />
              <ul style={{ padding: 0, marginLeft: 0, marginRight: '8vw' }}>
                {
                  category.postList && category.postList.length > 0 ? (
                    category.postList.map((post, postIndex) => (
                      <CustomLi key={postIndex} data={post}></CustomLi>
                    ))
                  ) : (
                    <div>게시글이 없네요!</div>
                  )
                }
              </ul>
            </Container>
          ))}

          </ContainerRow>
        </ContainerWrapper>
      </Wrapper>
    </div>
  );
};

export default Community;

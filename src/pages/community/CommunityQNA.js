//정보게시판 메인페이지
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styled from 'styled-components';
import palette from '../../styles/pallete';
import { baseAPI } from '../../config'
import CustomButton from '../../components/CustomButton';

const Title = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  // background-color: gold;
  margin: 30px 50px;
`;


const Main = styled.div`
  display: flex;
  margin: 0px 50px;
  flex-direction: column;
`;

const MainHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const MainBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const PostCard = styled.div`
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PostTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const PostDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 18px;
  color: #666;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const PageButton = styled.button`
  background-color: ${(props) => (props.active ? palette.skyblue : '#ccc')};
  border: none;
  margin: 0 10px;
  padding: 10px 20px;
  border-radius: 10px;
  color: ${(props) => (props.active ? 'white' : '#333')};
  font-size: 18px;
  
  &:hover {
    background-color: ${(props) => (props.active ? '#0080ff' : '#bbb')};
  }

  &:disabled {
    background-color: #eee;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const MyBtn = styled.button`
  background-color: ${(props) => props.color};
  border: none;
  width: 100px;
  height: 55px;
  border-radius: 20px;
  font-size: 30px;
  font-weight: bold;
  color: white;
  margin-left: 10px;
`;

const CommunityQNA = () => {
  const navigate = useNavigate();
  const [tempSearchText, setTempSearchText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // '2024-07-24' 형식으로 변환
  };

  const handleWrite = ()=> {
    navigate("/post/qna/write");
  }

  useEffect(() => {

    const fetchData = async () => {
      const url = searchText ?
        `/api/categories/QNA/posts?title=${searchText}&page=${currentPage}&size=10`
        :
        `/api/categories/QNA/posts?page=${currentPage}&size=10`;

      const response = await baseAPI.get(url);
      setData(response.data);
    };

    fetchData();
  }, [currentPage, searchText]);

  return (
    <>
      <Header />
      <Title>
        <h1>면접 관련  Q & A</h1>
        <CustomButton onClick={handleWrite} color={palette.skyblue}>글 작성</CustomButton>
      </Title>
      <Main>
        <MainHeader>
          <input
            type='text'
            placeholder="제목을 입력하세요"
            value={tempSearchText}
            onChange={(e) => setTempSearchText(e.target.value)}
            style={{ width: '60%', height: '50px', fontSize: '18px', marginBottom: '20px', 'border-radius': '10px' }}
          />
          <MyBtn
            color={palette.skyblue}
            onClick={() => {
              setSearchText(tempSearchText);
              setCurrentPage(0);
            }}>
            검색
          </MyBtn>
        </MainHeader>
        <MainBody>
          <MainContent>
            {data &&
              data.resultList.map((post, idx) => (
                <PostCard key={idx}
                  onClick={
                    () => navigate(`/post/${post.postId}`)}>
                  <PostTitle>- {post.title}</PostTitle>
                  <PostDetails>
                    <span>작성자 : {post.writerName}</span>
                    <span>작성일 : {formatDate(post.createTime)}</span>
                  </PostDetails>
                </PostCard>
              ))
            }
          </MainContent>
          {data && (
            <PaginationContainer>
              <PageButton
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                }}
                disabled={currentPage === 0}
              >
                이전
              </PageButton>
              {data.pageList.map((page) => (
                <PageButton
                  key={page}
                  onClick={() => {
                    setCurrentPage(page - 1);
                  }}
                  active={currentPage === page - 1}
                >
                  {page}
                </PageButton>
              ))}
              <PageButton
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
                disabled={currentPage === data.totalPage - 1}
              >
                다음
              </PageButton>
            </PaginationContainer>
          )}
        </MainBody>
      </Main>
    </>
  );
};

export default CommunityQNA;

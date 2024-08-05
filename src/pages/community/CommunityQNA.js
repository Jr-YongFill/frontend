//정보게시판 메인페이지
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styled from 'styled-components';
import { baseAPI } from '../../config'
import CustomButton from '../../components/CustomButton';
import Wrapper from "../../components/Wrapper";
import GlassCard from "../../components/GlassCard";
import PageButtonController from '../../components/PageButtonController';
import GlassModal from "../../components/modal/GlassModal";
import GlassInput from '../../components/GlassInput';
import { CircularProgress } from '@mui/material';

const Title = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin: 30px 50px;
  width:100%;
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
  width:40vw;
  align-items: center;
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

const PostTitle = styled.div`
  font-size: 1.5em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

`;

const PostDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 18px;
  color: #666;
`;

const CommunityQNA = () => {
  const navigate = useNavigate();
  const [tempSearchText, setTempSearchText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalOnClick, setModalOnClick] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // '2024-07-24' 형식으로 변환
  };

  const handleWrite = () => {
    navigate("/post/qna/write");
  }

  useEffect(() => {

    const fetchData = async () => {
      try {
        const url = searchText ?
          `/api/categories/QNA/posts?title=${searchText}&page=${currentPage}&size=10`
          :
          `/api/categories/QNA/posts?page=${currentPage}&size=10`;

        const response = await baseAPI.get(url);
        setData(response.data);
      } catch (error) {
        setModalText(error.response.data.message);
        setModalOnClick(() => () => {
          setIsModalOpen(false);
        })
        setIsModalOpen(true);
      }

    };

    fetchData();
  }, [currentPage, searchText]);

  return (
    <>
      <Header />
      <Wrapper>
        <div style={{
          marginTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          width: '60vw',
          alignItems: 'center'
        }}>
          <Title>
            <h1>면접 관련  Q & A</h1>
            <CustomButton onClick={handleWrite}>글 작성</CustomButton>
          </Title>
          <Main>
            <MainHeader>
              <GlassInput
                width={"100%"}
                type='text'
                placeholder="제목을 입력하세요"
                value={tempSearchText}
                onChange={(e) => setTempSearchText(e.target.value)}
              />
              <div style={{ width: '10px' }} />
              <CustomButton
                width={"100px"}
                onClick={() => {
                  setSearchText(tempSearchText);
                  setCurrentPage(0);
                }}>
                검색
              </CustomButton>
            </MainHeader>
            <MainBody>
            <MainContent>
                {data ?(
                  data.resultList.map((post, idx) => (
                    <GlassCard 
                      width={"58vw"}
                      key={idx}
                      onClick={
                        () => navigate(`/post/${post.postId}`)}>
                      <PostTitle>{post.title}</PostTitle>
                      <PostDetails>
                        <span>작성자 : {post.writerName}</span>
                        <span>작성일 : {formatDate(post.createTime)}</span>
                      </PostDetails>
                    </GlassCard>
                  ))):(
                    <CircularProgress color="secondary" />
                  )
                }
              </MainContent>
              <PageButtonController
                data={data}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            </MainBody>
          </Main>
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

export default CommunityQNA;

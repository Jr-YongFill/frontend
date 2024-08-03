//정보게시판 메인페이지
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styled from 'styled-components';
import palette from '../../styles/pallete';
import { baseAPI } from '../../config'
import CustomButton from '../../components/CustomButton';
import Wrapper from "../../components/Wrapper";
import GlassCard from "../../components/GlassCard";
import PageButtonController from '../../components/PageButtonController';
import GlassModal from "../../components/modal/GlassModal";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalOnClick, setModalOnClick] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleWrite = () => {
    navigate("/post/info/write");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = searchText ?
          `/api/categories/INFO/posts?title=${searchText}&page=${currentPage}&size=10`
          :
          `/api/categories/INFO/posts?page=${currentPage}&size=10`;

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
        <div style={{ marginTop: '30px' }}>
          <Title>
            <h1>정보 공유 게시판</h1>
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
                    <GlassCard key={idx}
                      onClick={
                        () => navigate(`/post/${post.postId}`)}>
                      <PostTitle>- {post.title}</PostTitle>
                      <PostDetails>
                        <span>작성자 : {post.writerName}</span>
                        <span>작성일 : {formatDate(post.createTime)}</span>
                      </PostDetails>
                    </GlassCard>
                  ))
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

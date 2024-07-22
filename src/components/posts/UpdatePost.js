import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';

const UpdatePost = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  return (
    <div>
      <Header />
      <h2>게시물 수정</h2>
      <button onClick={() => navigate('/post/info')}>(정보게시물)작성하기</button>
      <button onClick={() => navigate('/post/qna')}>(Q&A게시물)작성하기</button>
    </div>
  );
};

export default UpdatePost;

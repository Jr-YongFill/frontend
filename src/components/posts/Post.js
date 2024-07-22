import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';

const Post = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  return (
    <div>
      <Header />
      <h2>게시물</h2>
      <button onClick={() => navigate('/post/update')}>게시물 수정</button>
    </div>
  );
};

export default Post;

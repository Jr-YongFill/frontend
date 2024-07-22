import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Community = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  return (
    <div>
      <Header />
      <h2>커뮤니티</h2>
      <button onClick={() => navigate('/interview/main')}>면접 메인</button>
      <button onClick={() => navigate('/vote')}>투표</button>

      <button onClick={() => navigate('/post/info')}>정보 게시물</button>
      <button onClick={() => navigate('/post/qna')}>Q&A 게시물</button>


    </div>
  );
};

export default Community;

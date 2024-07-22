import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Home = () => {
  const navigate = useNavigate(); // useNavigate를 호출

  return (
    <div>
      <Header />
      <h2>홈 페이지</h2>
      <button onClick={() => navigate('/interview/main')}>면접 메인</button>
      <button onClick={() => navigate('/community')}>커뮤니티</button>
    </div>
  );
};

export default Home;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Store = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  return (
    <div>
      <Header />
      <h2>상점</h2>
      <button onClick={() => navigate('/interview/main')}>면접 메인</button>
    </div>
  );
};

export default Store;

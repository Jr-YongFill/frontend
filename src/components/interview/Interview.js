import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';

const Interview = () => {
  const navigate = useNavigate(); // useNavigate를 호출

  return (
      <div>
      <Header />
      <h2>면접 모드 선택</h2>
      <button onClick={() => navigate('/interview/result')}>면접 결과</button>
    </div>
  );
};

export default Interview;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';

const InterviewChoiceStack = () => {
  const navigate = useNavigate(); // useNavigate를 호출

  return (
    <div>
    <Header />
    <h2>스택선택하기</h2>
    <button onClick={() => navigate('/interview')}>면접</button>
  </div>
);
};

export default InterviewChoiceStack;

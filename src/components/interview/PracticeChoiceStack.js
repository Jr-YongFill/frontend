import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';

const PracticeChoiceStack = () => {
  const navigate = useNavigate(); // useNavigate를 호출

  return (
    <div>
      <Header />
      <h2>연습모드 스택선택</h2>
      <button onClick={() => navigate('/interview/practice')}>연습 면접</button>
    </div>
  );
};

export default PracticeChoiceStack;

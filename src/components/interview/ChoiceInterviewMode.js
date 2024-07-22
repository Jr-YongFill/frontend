import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';

const ChoiceInterviewMode = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  return (
    <div>
      <Header />
      <h2>면접 모드 선택</h2>     
      <button onClick={() => navigate('/interview/practice-choice-stack')}>연습 선택 스택</button>
      <button onClick={() => navigate('/interview/choice-stack')}>면접 선택 스택</button>

    </div>
  );
};

export default ChoiceInterviewMode;

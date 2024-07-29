import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import styled from 'styled-components';




const InterviewResult = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  return (
    <div>
      <Header />
      <h2>면접결과</h2>
      <button onClick={() => navigate('/interview/choice-mode')}>재도전</button>
      <button onClick={() => navigate('/interview/note')}>오답노트</button>
    </div>
  );
};


export default InterviewResult;

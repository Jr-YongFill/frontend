import React from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../Header';

const InterviewNote = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  return (
    <div>
      <Header/>
      <h2>오답노트</h2>
      <button onClick={() => navigate('/interview/choice-stack')}>면접 보러가기</button>
    </div>
  );
};

export default InterviewNote;

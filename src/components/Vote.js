import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Vote = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  return (
    <div>
      <Header />
      <h2>투표</h2>

    </div>
  );
};

export default Vote;

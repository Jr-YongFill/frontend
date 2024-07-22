import React from 'react';

import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Member = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  return (
    <div>
      <Header />
      <h2>마이페이지</h2>
    </div>
  );
};

export default Member;

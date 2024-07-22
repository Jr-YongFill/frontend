import React from 'react';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  return (
    <div>
      <Header />
      <h2>로그인 페이지</h2>
    </div>
  );
};

export default Signin;

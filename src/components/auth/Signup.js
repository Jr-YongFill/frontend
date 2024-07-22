import React from 'react';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  return (
    <div>
      <Header />
      <h2>회원가입 페이지</h2>
      <button onClick={() => navigate('../member/signin')}>회원가입</button>
    </div>
  );
};

export default Signup;

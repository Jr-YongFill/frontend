import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';


const InfoPost = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  return (
    <div>
      <Header />
      <h2>정보 게시판</h2>
      <button onClick={() => navigate('/post')}>글쓰기</button>
    </div>
  );

};

export default InfoPost;

//작성자 bbmini96
import React, { useState } from 'react';
import styled from 'styled-components';
import palette from '../../styles/pallete';
import { useNavigate } from 'react-router-dom';
import { baseAPI } from '../../config';
import Wrapper from "../../components/Wrapper";
import GlassCard from "../../components/GlassCard";
import Header from '../../components/Header';
import GlassModal from "../../components/modal/GlassModal";
import CustomButton from '../../components/CustomButton';

const Title = styled.h1`
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 15px 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  width: 100%;
  box-sizing: border-box;

  &::placeholder {
    color: #ccc;
  }

  &:focus {
    outline: none;
  }
`;

const LinkStyled = styled.a`
    display: block;
    text-align: right;
    margin-top: 10px;
    color: ${palette.skyblue};
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

const Signup = () => {
  const [userLogin, setUserLogin] = useState({ email: "", password: "", nickname: "" });
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalOnClick, setModalOnClick] = useState(null);

  const handleInputChange = (event) => {
    setUserLogin((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await baseAPI.post('/api/auth/sign-up', userLogin);

      setModalText('회원가입 성공');
      setModalOnClick(() => () => {
        setIsModalOpen(false);
        navigate('/auth/sign-in');
      })
      setIsModalOpen(true);
    } catch (error) {
      setModalText(error.response.data.message);
      setModalOnClick(() => () => {
        setIsModalOpen(false);
      })
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Header />
      <Wrapper>
        <GlassCard width={'500px'} height={'450px'}>
          <Title>회원가입</Title>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleInputChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              name="nickname"
              placeholder="Nickname"
              onChange={handleInputChange}
              required
            />
            <div style={{ paddingLeft: '80%' }}>
              <LinkStyled onClick={() => navigate('/auth/sign-in')}>로그인</LinkStyled>
            </div>
            <CustomButton type="submit">회원가입</CustomButton>
          </form>
        </GlassCard>
      </Wrapper>
      <GlassModal
        isModalOpen={isModalOpen}
        setIsModalOpen={() => setIsModalOpen(false)}
        message={modalText}
        onClick={modalOnClick} />
    </>
  );
};

export default Signup;
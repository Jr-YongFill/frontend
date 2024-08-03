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

const Title = styled.h1`
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
    color: ${palette.skyblue};
`;

const Input = styled.input`
    width: 100%;
    padding: 15px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;

    &:focus {
        border-color: ${palette.skyblue};
        outline: none;
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 15px;
    margin: 30px 0 10px 0;
    background-color: ${palette.skyblue};
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${palette.gray};
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
        <GlassCard>
          <Title>회원가입</Title>
          <form onSubmit={handleSubmit}>
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
            <Button type="submit">회원가입</Button>
            <LinkStyled onClick={() => navigate('/auth/sign-in')}>로그인</LinkStyled>
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
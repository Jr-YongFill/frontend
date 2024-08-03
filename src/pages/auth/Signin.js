//작성자 bbmini96
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import palette from '../../styles/pallete';
import { baseAPI } from '../../config';
import Header from '../../components/Header';
import Wrapper from "../../components/Wrapper";
import GlassCard from "../../components/GlassCard";
import { localStorageSetValue } from '../../utils/CryptoUtils';
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
    margin: 10px 0;
    color: ${palette.skyblue};
    cursor: pointer;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const Signin = () => {
  const [userLogin, setUserLogin] = useState({ email: '', password: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalOnClick, setModalOnClick] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUserLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await baseAPI.post('/api/auth/sign-in', userLogin);

      const { id, accessToken, refreshToken, tokenType, role, nickName } = response.data;
      localStorageSetValue('member-id', id);
      localStorageSetValue('accessToken', accessToken);
      localStorageSetValue('refreshToken', refreshToken);
      localStorageSetValue('tokenType', tokenType);
      localStorageSetValue('member-role', role);
      localStorageSetValue('member-nickName', nickName);

      setModalText('로그인에 성공하셨습니다.');
      setModalOnClick(() => () => {
        setIsModalOpen(false);
        navigate('/');
      })
      setIsModalOpen(true);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : '로그인 실패';
      setModalText(errorMessage);
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
        <GlassCard width={'500px'} height={'350px'}>
          <Title>로그인</Title>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Input
              type="email"
              name="email"
              value={userLogin.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              required
            />
            <Input
              type="password"
              name="password"
              value={userLogin.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
            />
            <div style={{ paddingLeft: '80%' }}>
              <LinkStyled onClick={() => navigate('/auth/sign-un')}>회원가입</LinkStyled>
            </div>
            <CustomButton type="submit">로그인</CustomButton>
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

export default Signin;
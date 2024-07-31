//작성자 bbmini96
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import palette from '../../styles/pallete';
import { baseAPI } from '../../config';
import Header from '../../components/Header';

const WrapperContainer = styled.div`
    height: 50vh;
    display: flex;
    justify-content: center;
    align-items: top;
    margin-top: 50px;
`;

const FormContainer = styled.div`
    width: 400px;
    padding: 40px;
    border: 1px solid ${palette.skyblue};
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    background-color: white;
`;

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
    margin: 10px 0;
    background-color: ${palette.skyblue};
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
    box-sizing: border-box;

    &:hover {
        background-color: ${palette.gray};
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
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUserLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await baseAPI.post('/api/auth/sign-in', userLogin);

      const { id, accessToken, refreshToken, tokenType, role } = response.data;
      localStorage.setItem('id', id);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('tokenType', tokenType);
      localStorage.setItem('role', role);

      alert('로그인 성공');
      navigate('/');
    } catch (error) {
      alert(error.response.message || '로그인 실패');
    }
  };

  return (
    <>
      <Header />
      <WrapperContainer>
        <FormContainer>
          <Title>로그인</Title>
          <form onSubmit={handleSubmit}>
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
            <LinkStyled onClick={() => navigate('/auth/sign-up')}>회원가입</LinkStyled>
            <Button type="submit">로그인</Button>
          </form>
        </FormContainer>
      </WrapperContainer>
    </>
  );
};

export default Signin;
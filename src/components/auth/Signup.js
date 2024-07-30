import React, { useState } from 'react';
import Header from '../Header';
import styled from 'styled-components';
import palette from '../../styles/pallete';
import { useNavigate } from 'react-router-dom';
import { fetchUserSingup } from './FetchMember';

const WrapperContainer = styled.div`
    height: 70vh; 
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

  const handleInputChange = (e) => {
    setUserLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchUserSingup(userLogin.email, userLogin.password, userLogin.nickname)
      .then(() => {
        alert('회원가입 성공');
        navigate('/auth/sign-in');
      })
      .catch(error => {
        alert(error.response.data.message);
      });
  };

  return (
    <>
      <Header />
      <WrapperContainer>
        <FormContainer>
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
        </FormContainer>
      </WrapperContainer>
    </>
  );
};

export default Signup;

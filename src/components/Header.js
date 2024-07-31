import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import palette from '../styles/pallete';
import { baseAPI } from '../config';

const HeaderContainer = styled.header`
  top: 0;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  z-index: 9;
  background: ${palette.skyblue};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--color);
  font-size: 18px;
  cursor: pointer;
  margin-left: 15px;
  margin-left: 15px;
`;

const HeaderGnb = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 100px;
`;

const MainLink = styled(StyledLink)`
  font-size: 34px;
  font-weight: 700;
`;

const GnbMenu = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
`;

const HeaderSign = styled.div`
  display: flex;
  gap: 30px;
`;

const LogoutButton = styled.span`
  color: var(--color);
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
  margin-left: 10px;
`;
const Header = ({ color }) => {
  const [nickName, setNickname] = useState('');

  useEffect(() => {
    const checkLoginStatus = () => {
      const nickName = localStorage.getItem('nickName');
      setNickname(!!nickName);
    };

    checkLoginStatus();
  }, []);

  const logoutHandle = async () => {
    if (localStorage != null) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenType');
      localStorage.removeItem('id');
      localStorage.removeItem('role');
      localStorage.removeItem('nickName');
      window.document.location = '/';
    }
  };

  const style = {
    background: color,
    color: 'black'
  };



  return (
    <HeaderContainer style={style}>
      <HeaderGnb style={style}>
        <MainLink to="/">
          <span>용가리</span>
        </MainLink>
        <GnbMenu>
          <StyledLink to="/interview/main">
            <span>면접보러가기</span>
          </StyledLink>
          <StyledLink to="/store">
            <span>상점</span>
          </StyledLink>
          <StyledLink to="/community/main">
            <span>커뮤니티</span>
          </StyledLink>
        </GnbMenu>
      </HeaderGnb>
      <HeaderSign style={style}>
        {nickName ? (
          <div>
            <span>{localStorage.getItem('nickName')}</span>
            <StyledLink to="/member">마이페이지</StyledLink>
            <LogoutButton onClick={logoutHandle}>로그아웃</LogoutButton>
          </div>
        ) : (
          <div>
            <StyledLink to="/auth/sign-in">로그인</StyledLink>
            <StyledLink to="/auth/sign-up">회원가입</StyledLink>
          </div>
        )}
      </HeaderSign>
    </HeaderContainer>
  );
};

export default Header;
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  top: 0;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 30px;
  z-index: 9;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--color);
  font-size: 18px;
  cursor: pointer;
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
`;

const Header = ({ color }) => {

  const style = {
    'background': color,
    'color': 'black'
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
          <StyledLink to="/community">
            <span>커뮤니티</span>
          </StyledLink>
        </GnbMenu>
      </HeaderGnb>
      <HeaderSign style={style}>
        
        <div>
        <StyledLink to="/auth/signin">로그인</StyledLink>
        <StyledLink to="/auth/signup">회원가입</StyledLink>
        </div>
        <div>
          <span>닉네임</span>
          <StyledLink to="/member">마이페이지</StyledLink>
        </div>
        
      </HeaderSign>
    </HeaderContainer>
  );
};

export default Header;

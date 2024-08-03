import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import palette from '../styles/pallete';
import { localStorageGetValue } from '../utils/CryptoUtils';
import GlassModal from "./modal/GlassModal";

const Logo = styled.div`
  font-size: 1.5rem;
  color: white;
`

const HeaderContainer = styled.header`
  position: absolute;
  top: 0;
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  width:90vw;
  z-index: 999;
  background: transparent;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.active ? 'white' : palette.gray};
  font-size: 1rem;
  cursor: pointer;
  margin-left: 15px;

  &:hover {
    color: white;
  }
`;

const HeaderGnb = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MainLink = styled(StyledLink)`
  font-size: 34px;
  font-weight: 700;
`;

const GnbMenu = styled.div`
  display: flex;
  gap: 3vw;
  align-items: center;
  margin-left:5vw;
`;

const HeaderSign = styled.div`
 display: flex;
  gap: 3vw;
  align-items: center;
`;

const LogoutButton = styled.span`
  color: ${palette.gray};
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    color: white;
  }
`;

const Header = ({ color }) => {
  const [nickName, setNickName] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalOnClick, setModalOnClick] = useState(null);

  useEffect(() => {
    const nickName = localStorageGetValue('member-nickName');
    setNickName(nickName);
    const role = localStorageGetValue('member-role');
    setRole(role);
  }, []);

  const logoutHandle = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const LinkClick = (event, path) => {
    if (!role) {
      event.preventDefault();
      setModalText('로그인이 필요한 페이지 입니다.');
      setModalOnClick(() => () => {
        setIsModalOpen(false);
        navigate('/auth/sign-in');
      })
      setIsModalOpen(true);
    } else {
      navigate(path);
    }
  };

  return (
    <HeaderContainer style={{ background: color }}>
      <HeaderGnb>
        <MainLink to="/">
          <Logo>모시모시</Logo>
        </MainLink>

      </HeaderGnb>
      <GnbMenu>
        <StyledLink
          to="/interview/main"
          onClick={(event) => LinkClick(event, '/interview/main')}
          active={location.pathname === '/interview/main'}
        >
          <span>면접보러가기</span>
        </StyledLink>
        <StyledLink
          to="/store"
          onClick={(event) => LinkClick(event, '/store')}
          active={location.pathname === '/store'}
        >
          <span>상점</span>
        </StyledLink>
        <StyledLink
          to="/community/main"
          active={location.pathname === '/community/main' || location.pathname === '/post'}
        >
          <span>커뮤니티</span>
        </StyledLink>
      </GnbMenu>
      <HeaderSign>
        {nickName ? (
          <div>
            <span>{nickName}</span>
            <StyledLink
              to="/member"
              onClick={(event) => LinkClick(event, '/member')}
              active={location.pathname === '/member'}
            >
              마이페이지
            </StyledLink>
            <LogoutButton onClick={logoutHandle}>로그아웃</LogoutButton>
          </div>
        ) : (
          <div>
            <StyledLink to="/auth/sign-in">로그인</StyledLink>
            <StyledLink to="/auth/sign-up">회원가입</StyledLink>
          </div>
        )}
      </HeaderSign>
      <GlassModal
        isModalOpen={isModalOpen}
        setIsModalOpen={() => setIsModalOpen(false)}
        message={modalText}
        onClick={modalOnClick} />
    </HeaderContainer>
  );
};

export default Header;

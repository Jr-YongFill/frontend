import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import palette from '../styles/pallete';
import { baseAPI } from '../config';
import { localStorageGetValue, localStorageSetValue } from '../utils/cryptoUtils';

const WrapperContainer = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f0f4ff;
    padding: 20px;
    box-sizing: border-box;
`;

const Box = styled.div`
    width: 90%;
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Title = styled.h2`
    font-weight: bold;
    margin: 0;
`;

const TopContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Line = styled.hr`
    width: 100%;
    border: 5px solid ${palette.skyblue};
    border-radius: 30px;
    margin: 20px 0;
`;

const MiddelContainer = styled.div`
    display: flex;
    width: 100%;
    gap: 20px;
    margin-bottom: 20px;
`;

const ImageContainer = styled.div`
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const ProfileImage = styled.img`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    cursor: pointer;
`;

const Button = styled.button`
    color: white;
    background-color: ${palette.skyblue};
    border: none;
    border-radius: 20px;
    padding: 10px 30px;
    cursor: pointer;
`;

const StyledButton = styled(Button)`
    white-space: nowrap;
    width: auto; 
    margin-left:10px;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: center;
`;

const FileInput = styled.input`
    width: 50%;
    padding: 10px;
`;

const ImageUpdateButton = styled(Button)`
    width: 45%;
`;

const Input = styled.input`
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    box-sizing: border-box;
`;

const MemberUpdateContainer = styled.div`
    width: 55%;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const NicknameContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const NicknameInput = styled.div`
    display: flex;
    align-items: center;
`;

const PasswordContainer = styled(NicknameContainer)`
    margin-top: 20px;
`;

const PasswordButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-top: 20px;
`;

const BottomContainer = styled(MiddelContainer)``;

const PostContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const CommentContainer = styled(PostContainer)``;

const LinkStyled = styled(Link)`
  text-decoration: none;
  color: blue;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const Member = () => {
  const [nickName, setNickname] = useState("");
  const [originalNickName, setOriginalNickname] = useState("");
  const [memberId, setMemberId] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [originalProfileImage, setOriginalProfileImage] = useState(null);
  const [postData, setPostData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setMemberId(localStorageGetValue('member-id'));
    setMemberId(localStorageGetValue('member-nickName'));

    const fetchMemberData = async () => {
      if (memberId) {
        try {
          const response = await baseAPI.get(`/api/members/${memberId}`);
          setProfileImage(response.data.filePath);
          setOriginalProfileImage(response.data.filePath);
          setOriginalNickname(response.data.nickName);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchMemberData();

    const fetchPostData = async () => {
      if (memberId) {
        try {
          const response = await baseAPI.get(`/api/members/${memberId}/posts?page=0&size=5`);
          setPostData(response.data.resultList);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchPostData();

    const fetchCommentData = async () => {
      if (memberId) {
        try {
          const response = await baseAPI.get(`/api/members/${memberId}/comments?page=0&size=5`);
          setCommentData(response.data.resultList);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchCommentData();
  }, [memberId]);

  const deleteHandle = async (event) => {
    event.preventDefault();
    try {
      await baseAPI.delete(`/api/members/${memberId}`);
      localStorage.clear();
      alert("회원 탈퇴 성공");
      navigate('/');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCheckPasswordChange = (event) => {
    setCheckPassword(event.target.value);
  };

  const handleImageChange = (event) => {
    const fileInfo = event.target.files[0];
    if (fileInfo) {
      setFile(fileInfo);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(fileInfo);
    }
  };

  const handleNameChange = (event) => {
    setNickname(event.target.value);
  };

  const UpdatePasswordHandle = async (event) => {
    event.preventDefault();
    if (password === "" || checkPassword === "" || password !== checkPassword) {
      alert("비밀번호가 일치하지 않거나 비밀번호가 입력되지 않았습니다.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('password', password);

      await baseAPI.patch(`/api/members/${memberId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert("비밀번호 변경이 완료되었습니다.");
      navigate('/member');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const UpdateImageHandle = async (event) => {
    event.preventDefault();

    const changeNickName = originalNickName !== nickName || file !== null;

    if (!changeNickName) {
      alert("변경된 사항이 없습니다.");
      return;
    }

    if (nickName.trim() === "") {
      alert("닉네임을 입력하세요.");
      return;
    }

    try {
      const formData = new FormData();
      if (nickName !== originalNickName) {
        formData.append('nickname', nickName);
      }
      if (file) {
        formData.append('file', file);
      }

      await baseAPI.patch(`/api/members/${memberId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (nickName !== originalNickName) {
        localStorageSetValue('member-nickName', nickName);
      }

      alert("프로필 수정 성공");
      window.location.reload();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <Header />
      <WrapperContainer>
        <Box>
          <TopContainer>
            <Title>마이페이지</Title>
            <Button onClick={deleteHandle}>탈퇴하기</Button>
          </TopContainer>
          <Line />

          <MiddelContainer>
            <ImageContainer>
              <ProfileImage src={profileImage} alt="Profile 선택" />
              <ButtonContainer>
                <FileInput type="file" accept="image/*" onChange={handleImageChange} />
                <ImageUpdateButton onClick={UpdateImageHandle}>수정하기</ImageUpdateButton>
              </ButtonContainer>
            </ImageContainer>

            <MemberUpdateContainer>
              <NicknameContainer>
                <Title>닉네임 변경</Title>
                <NicknameInput>
                  <Input
                    type="text"
                    placeholder="닉네임"
                    value={nickName}
                    onChange={handleNameChange}
                  />
                  <StyledButton onClick={UpdateImageHandle}>수정하기</StyledButton>
                </NicknameInput>
              </NicknameContainer>
              <PasswordContainer>
                <Title>비밀번호 변경</Title>
                <Input
                  type="password"
                  placeholder="새 비밀번호"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <Input
                  type="password"
                  placeholder="비밀번호 확인"
                  value={checkPassword}
                  onChange={handleCheckPasswordChange}
                />
                <PasswordButtonContainer>
                  <StyledButton onClick={UpdatePasswordHandle}>변경하기</StyledButton>
                </PasswordButtonContainer>
              </PasswordContainer>
            </MemberUpdateContainer>
          </MiddelContainer>

          <BottomContainer>
            <PostContainer>
              <Title>내가 쓴 글</Title>
              <ul>
                {postData.map((post, index) => (
                  <li key={index}>{post.title}</li>
                ))}
              </ul>
              <LinkStyled to='/post/:id' style={{ textAlign: 'right' }}>게시글 조회</LinkStyled>
            </PostContainer>
            <CommentContainer>
              <Title>내가 쓴 댓글</Title>
              <ul>
                {commentData.map((comment, index) => (
                  <li key={index}>{comment.content}</li>
                ))}
              </ul>
            </CommentContainer>
          </BottomContainer>
        </Box>
      </WrapperContainer>
    </>
  );
};

export default Member;
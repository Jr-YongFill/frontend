import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import defaultImage from '../assets/default.png';
import palette from '../styles/pallete';
import { baseAPI } from '../config';

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

const PostContainer = styled.div`
    display: flex;
    width: 100%;
    gap: 20px;
`;

const AnswerNoteBox = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 20px;
`;

const PostAndCommentBox = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const PostBox = styled(AnswerNoteBox)``;

const CommentBox = styled(PostBox)``;

const Member = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [nickName, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [memberId, setMemberId] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const memberId = localStorage.getItem('id');
        setMemberId(memberId);
        const response = await baseAPI.get(`/api/members/${memberId}`);
        setProfileImage(response.data.filePath);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMemberData();
  }, []);

  const deleteHandle = async (event) => {
    event.preventDefault();
    try {
      await baseAPI.delete(`/api/members/${memberId}`);
      localStorage.removeItem('id');
      localStorage.removeItem('tokenType');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      alert("회원 탈퇴 성공");
      navigate('/');
    } catch (error) {
      alert("회원 탈퇴 실패: " + error.response.data.message);
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
    if (password !== checkPassword) {
      alert("비밀번호가 일치하지 않습니다.");
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
      alert("비밀번호 변경 실패: " + error.response.data.message);
    }
  };

  const UpdateImageHandle = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('nickname', nickName);
      formData.append('file', file);

      await baseAPI.patch(`/api/members/${memberId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert("프로필 수정 성공");
      window.location.reload();
    } catch (error) {
      alert("프로필 이미지 수정 실패: " + error.response.data.message);
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
              <ProfileImage src= {profileImage} alt="Profile 선택" />
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
                    value={nickName}
                    placeholder="nickName"
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
                  <Button onClick={UpdatePasswordHandle}>변경하기</Button>
                </PasswordButtonContainer>
              </PasswordContainer>
            </MemberUpdateContainer>
          </MiddelContainer>

          <PostContainer>
            <AnswerNoteBox>
              <Title>내 오답노트</Title>
              <ul>
                <li>게시글</li>
                <li>게시글</li>
                <li>게시글</li>
                <li>게시글</li>
                <li>게시글</li>
              </ul>
            </AnswerNoteBox>

            <PostAndCommentBox>
              <PostBox>
                <Title>내가 쓴 글</Title>
                <ul>
                  <li>게시글</li>
                  <li>게시글</li>
                  <li>게시글</li>
                </ul>
              </PostBox>

              <CommentBox>
                <Title>내가 쓴 댓글</Title>
                <ul>
                  <li>게시글</li>
                  <li>게시글</li>
                  <li>게시글</li>
                </ul>
              </CommentBox>
            </PostAndCommentBox>
          </PostContainer>
        </Box>
      </WrapperContainer>
    </>
  );
};
export default Member;

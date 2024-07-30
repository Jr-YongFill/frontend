//작성자 bbmini96
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import defaultImage from '../assets/default.png';
import palette from '../styles/pallete';
import { baseAPI } from '../config';

const WrapperContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f0f4f8;
    padding: 20px;
`;

const Box = styled.div`
    width: 80%;
    background-color: white;
    padding: 50px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin: 20px;
`;

const Title = styled.h2`
    font-weight: bold;
    margin: 0;
`;

const TitleHeader = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
`;

const Line = styled.hr`
    width: 100%;
    border: 5px solid ${palette.skyblue};
    border-radius: 30px;
    margin: 0;
`;

const Button = styled.button`
    color: white;
    background-color: ${palette.skyblue};
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: pointer;
`;

const ImageContainer = styled.div`
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const ProfileImage = styled.img`
    width: 250px;
    height: 250px;
    border-radius: 50%;
    margin: 20px 0;
    cursor: pointer;
`;

const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const FileInput = styled.input`
    width: 50%;
    margin: 10px 0;
    padding: 10px;
`;

const ImageUpdateButton = styled.button`
    width: 50%;
    color: white;
    background-color: ${palette.skyblue};
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    margin-left: auto;
`;

const Input = styled.input`
    margin: 10px 10px 10px 0px;
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
    margin-top: auto;
    margin-left: auto;
`;

const NicknameContainer = styled.div`
    margin-bottom: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column; 
`;
const NicknameInput = styled.div`
    display: flex;
    align-items: center;
`;

const NicknameLabel = styled.label`
    margin-bottom: 5px;
    font-weight: bold;
`;
const PasswordContainer = styled.div`
    margin-bottom: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
`;
const PasswordLabel = styled.label`
    margin-bottom: 5px;
    font-weight: bold;
`;
const CommunityContainer = styled.div`
    width: 100%;
    max-width: 850px;
    background-color: white;
    padding: 50px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    display: flex;
`;

const AnswerNoteBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 50%;
    height: 100%;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const PostAndCommentBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 50%;
    hight: 100%
`;

const PostBox = styled.div`
    width: 100%;
    height: 50%;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const CommentBox = styled.div`
    width: 100%;
    height: 50%;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const List = styled.ul`
    list-style-type: none;
    padding: 10px;
    margin: 10px;
`;

const ListLi = styled.li`
    margin: 10px 0;
`;

const ContainerLi = styled.li`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  list-style: none;
  padding:3px 0px;
  cursor:pointer;
`

const Member = () => {
  const [profileImage, setProfileImage] = useState(defaultImage);
  const [nickName, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [memberId, setMemberId] = useState(null);
  const [filePath, setFilePath] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const memberId = localStorage.getItem('id');
    setMemberId(memberId);
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
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setFilePath(URL.createObjectURL(file));
        setFileName(file.name);
        setFileSize(file.size);
      };
      reader.readAsDataURL(file);
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
      formData.append('file_path', filePath);
      formData.append('attachment_file_name', fileName);
      formData.append('attachment_file_size', fileSize);

      await baseAPI.patch(`/api/members/${memberId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert("프로필 수정 성공");
      window.document.location= '/member';
    } catch (error) {
      alert("프로필 이미지 수정 실패: " + error.response.data.message);
    }
  };

  return (
    <>
      <Header />
      <WrapperContainer>
        <Box>
          <TitleHeader>
            <Title>마이페이지</Title>
            <Button onClick={deleteHandle}>탈퇴하기</Button>
          </TitleHeader>
          <Line />

          <div style={{ display: 'flex' }}>
            <ImageContainer>
              <ProfileImage src={profileImage} alt="Profile 선택" />
              <ButtonContainer>
                <FileInput type="file" accept="image/*" onChange={handleImageChange} />
                <ImageUpdateButton onClick={UpdateImageHandle}>수정하기</ImageUpdateButton>
              </ButtonContainer>
            </ImageContainer>

            <MemberUpdateContainer>
              <NicknameContainer>
                <NicknameLabel>닉네임 변경</NicknameLabel>
                <NicknameInput>
                  <Input
                    type="text"
                    style={{ width: '80%' }}
                    value={nickName}
                    onChange={handleNameChange}
                  />
                  <Button onClick={UpdateImageHandle} style={{ width: '20%' }}>수정하기</Button>
                </NicknameInput>
              </NicknameContainer>
              <PasswordContainer>
                <PasswordLabel>비밀번호 변경</PasswordLabel>
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
                <ButtonContainer>
                  <Button onClick={UpdatePasswordHandle}>변경하기</Button>
                </ButtonContainer>
              </PasswordContainer>
            </MemberUpdateContainer>
          </div>
        </Box>

        <CommunityContainer>
          <AnswerNoteBox>
            <Title>내 오답노트</Title>
            <List>
              <ListLi>오답노트</ListLi>
              <ListLi>오답노트</ListLi>
              <ListLi>오답노트</ListLi>
              <ListLi>오답노트</ListLi>
            </List>
          </AnswerNoteBox>

          <PostAndCommentBox>
            <PostBox>
              <Title>내가 쓴 글</Title>
              <List>
                <ListLi>게시글</ListLi>
                <ListLi>게시글</ListLi>
                <ListLi>게시글</ListLi>
                <ListLi>게시글</ListLi>
              </List>
            </PostBox>

            <CommentBox>
              <Title>내가 쓴 댓글</Title>
              <List>
                <ListLi>댓글</ListLi>
                <ListLi>댓글</ListLi>
                <ListLi>댓글</ListLi>
                <ListLi>댓글</ListLi>
              </List>
            </CommentBox>
          </PostAndCommentBox>
        </CommunityContainer>
      </WrapperContainer>
    </>
  );
};
export default Member;
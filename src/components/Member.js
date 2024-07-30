import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import defaultImage from '../assets/default.png';
import palette from '../styles/pallete';

const WrapperContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f0f4f8;
    padding: 20px;
`;

const Box = styled.div`
    width: 100%;
    max-width: 850px;
    background-color: white;
    padding: 50px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
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

const Member = () => {
  const [profileImage, setProfileImage] = useState(defaultImage);
  const [nickname, setNickname] = useState("");
  const [filePath, setFilePath] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const navigate = useNavigate();

  const deleteHandle = async (event) => {
    event.preventDefault();
    const memberId = '{member_id}';
    try {
      await axios.delete(`/members/${memberId}`);
      alert("회원 탈퇴");
      navigate('/');
    } catch (error) {
      alert(error.response.data.message);
    }
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

  const UpdateImageHandle = async (event) => {
    event.preventDefault();
    const memberId = '{member_id}';
    const formData = new FormData();

    formData.append('file_path', filePath);
    formData.append('attachment_file_name', fileName);
    formData.append('attachment_file_size', fileSize);

    await axios.patch(`/api/members/${memberId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
                    style={{ width: '75%' }}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <Button style={{ width: '25%' }}>수정하기</Button>
                </NicknameInput>
              </NicknameContainer>
              <PasswordContainer>
                <PasswordLabel>비밀번호 변경</PasswordLabel>
                <Input type="password" placeholder="새 비밀번호" />
                <Input type="password" placeholder="비밀번호 확인" />
                <ButtonContainer>
                  <Button>변경하기</Button>
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

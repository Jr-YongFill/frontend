import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import palette from "../styles/pallete";
import { baseAPI } from "../config";
import {
  localStorageGetValue,
  localStorageSetValue,
} from "../utils/CryptoUtils";
import Wrapper from "../components/Wrapper";
import Block from "../components/Block";
import GlassCard from "../components/GlassCard";
import CustomLi from "../components/CustomLi";
import NPGlassCard from "../components/NoPaddingGlassCard";
import GlassModal from "../components/modal/GlassModal";
import GlassInput from "../components/GlassInput";
import { RemoveModal } from "../components/modal/RemoveModal";
import { tr } from 'date-fns/locale';
import CustomButton from '../components/CustomButton';

const Title = styled.h2`
  font-weight: bold;
  margin: 0;
  o
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 999;
  height: 100%;
  padding: 20px;
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
  background-color: ${palette.dark};
  border: none;
  border-radius: 20px;
  padding: 10px 30px;
  cursor: pointer;
  height:40px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  justify-content: center;
`;

const FileInput = styled.input`
  display: none;
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
  justify-content: space-between;
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

const BottomContainer = styled(MiddelContainer)`
  display:flex;
  justify-content: space-between;
  gap:1vw
`;


const Member = () => {
  const [nickName, setNickname] = useState("");
  const [originalNickName, setOriginalNickname] = useState("");
  const [memberId, setMemberId] = useState(localStorageGetValue("member-id"));
  const [profileImage, setProfileImage] = useState(null);
  const [originalProfileImage, setOriginalProfileImage] = useState(null);
  const [postData, setPostData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalOnClick, setModalOnClick] = useState(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(null);

  useEffect(() => {
    setMemberId(localStorageGetValue("member-id"));
    setNickname(localStorageGetValue("member-nickName"));

    const fetchMemberData = async () => {
      if (memberId) {
        try {
          const response = await baseAPI.get(`/api/members/${memberId}`);
          setProfileImage(response.data.filePath);
          setOriginalProfileImage(response.data.filePath);
          setOriginalNickname(response.data.nickName);
        } catch (error) {
          setModalText(error.response.data.message);
          setModalOnClick(() => () => {
            setIsModalOpen(false);
          })
          setIsModalOpen(true);
        }
      }
    };
    fetchMemberData();

    const fetchPostData = async () => {
      if (memberId) {
        try {
          const response = await baseAPI.get(
            `/api/members/${memberId}/posts?page=0&size=5`
          );
          setPostData(response.data.resultList);
        } catch (error) {
          setModalText(error.response.data.message);
          setModalOnClick(() => () => {
            setIsModalOpen(false);
          })
          setIsModalOpen(true);
        }
      }
    };
    fetchPostData();

    const fetchCommentData = async () => {
      if (memberId) {
        try {
          const response = await baseAPI.get(
            `/api/members/${memberId}/comments?page=0&size=5`
          );
          setCommentData(response.data.resultList);
        } catch (error) {
          setModalText(error.response.data.message);
          setModalOnClick(() => () => {
            setIsModalOpen(false);
          })
          setIsModalOpen(true);
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

      setIsRemoveModalOpen(false);
      setModalText("회원 탈퇴 성공");
      setModalOnClick(() => () => {
        setIsModalOpen(false);
        navigate("/");
      })
      setIsModalOpen(true);
    } catch (error) {
      setModalText(error.response.data.message);
      setModalOnClick(() => () => {
        setIsModalOpen(false);
      })
      setIsModalOpen(true);
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
      setModalText("비밀번호가 일치하지 않거나 비밀번호가 입력되지 않았습니다.");
      setModalOnClick(() => () => {
        setIsModalOpen(false);
      })
      setIsModalOpen(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("password", password);

      await baseAPI.patch(`/api/members/${memberId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setModalText("비밀번호 변경이 완료되었습니다.");
      setModalOnClick(() => () => {
        setIsModalOpen(false);
        navigate("/member");
      })
      setIsModalOpen(true);
    } catch (error) {
      setModalText(error.response.data.message);
      setModalOnClick(() => () => {
        setIsModalOpen(false);
      })
      setIsModalOpen(true);
    }
  };

  const UpdateImageHandle = async (event) => {
    event.preventDefault();

    const changeNickName = originalNickName !== nickName || file !== null;

    if (!changeNickName) {
      setModalText("변경된 사항이 없습니다.");
      setModalOnClick(() => () => {
        setIsModalOpen(false);
      })
      setIsModalOpen(true);
      return;
    }

    if (nickName.trim() === "") {
      setModalText("닉네임을 입력하세요.");
      setModalOnClick(() => () => {
        setIsModalOpen(false);
      })
      setIsModalOpen(true);
      return;
    }

    try {
      const formData = new FormData();
      if (nickName !== originalNickName) {
        formData.append("nickname", nickName);
      }
      if (file) {
        formData.append("file", file);
      }

      await baseAPI.patch(`/api/members/${memberId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (nickName !== originalNickName) {
        localStorageSetValue("member-nickName", nickName);
      }

      setModalText("프로필 수정 성공");
      setModalOnClick(() => () => {
        setIsModalOpen(false);
        window.location.reload();
      })
      setIsModalOpen(true);
    } catch (error) {
      setModalText(error.response.data.message);
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
        <div style={{ width: '60vw' }}>
          <Block></Block>
          <NPGlassCard>
            <TopContainer>
              <Title>마이페이지</Title>
              <CustomButton onClick={() => setIsRemoveModalOpen(true)}>탈퇴하기</CustomButton>
            </TopContainer>
            <div style={{ padding: "20px" }}>
              <MiddelContainer>
                <ImageContainer>
                  <ProfileImage src={profileImage} alt="Profile 선택" />
                  <ButtonContainer>
                    <label for="file"
                      style={{
                        backgroundColor: palette.dark,
                        border: 'none',
                        width: '12vh',
                        paddingTop: '6px',
                        height: '4vh',
                        borderRadius: '10px',
                        fontSize: '1em',
                        color: 'white',
                        cursor: 'pointer',
                        textAlign: 'center',
                        margin: '10px 0',
                        '&:hover': {
                          backgroundColor: palette.purple
                        }
                      }}>
                      <div class="btn-upload">파일 업로드</div>
                    </label>
                    <FileInput
                      id='file'
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <CustomButton onClick={UpdateImageHandle} width={"100px"}>
                      수정하기
                    </CustomButton>
                  </ButtonContainer>
                </ImageContainer>

                <MemberUpdateContainer>
                  <NicknameContainer>
                    <Title>닉네임 변경</Title>
                    <NicknameInput>
                      <GlassInput
                        width={"60%"}
                        type="text"
                        placeholder="닉네임"
                        value={nickName}
                        onChange={handleNameChange}
                      />
                      <CustomButton onClick={UpdateImageHandle}>
                        수정하기
                      </CustomButton>
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
                      <CustomButton onClick={UpdatePasswordHandle}>
                        변경하기
                      </CustomButton>
                    </PasswordButtonContainer>
                  </PasswordContainer>
                </MemberUpdateContainer>
              </MiddelContainer>

              <BottomContainer>
                <GlassCard width={"25vw"}>
                  <Title>내가 쓴 글</Title>
                  <ul style={{ marginLeft: '-40px' }}>
                    {postData.map((post, index) => (
                      <CustomLi key={index} data={post} isMine={true} />
                    ))}
                  </ul>
                </GlassCard>
                <GlassCard width={"25vw"}>
                  <Title>내가 쓴 댓글</Title>
                  <ul style={{ marginLeft: '-40px' }}>
                    {commentData.map((comment, index) => (
                      <CustomLi key={index} data={comment} isMine={true} />
                    ))}
                  </ul>
                </GlassCard>
              </BottomContainer>
            </div>
          </NPGlassCard>
        </div >
      </Wrapper >

      <GlassModal
        isModalOpen={isModalOpen}
        setIsModalOpen={() => setIsModalOpen(false)}
        message={modalText}
        onClick={modalOnClick} />
      <RemoveModal
        isModalOpen={isRemoveModalOpen}
        setIsModalOpen={() => setIsRemoveModalOpen(false)}
        onClick={deleteHandle} />
    </>
  );
};

export default Member;

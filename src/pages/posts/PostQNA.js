import React, { useRef, useState } from "react";
import styled from "styled-components";
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import Header from "../../components/Header";
import EditorBox from "../../components/posts/EditorBox";
import palette from "../../styles/pallete";
import { useNavigate } from "react-router-dom";
import { baseAPI } from "../../config";
import { localStorageGetValue } from "../../utils/CryptoUtils";
import Wrapper from "../../components/Wrapper";
import GlassCard from "../../components/GlassCard";
import Block from "../../components/Block";
import CustomButton from "../../components/CustomButton";


const TitleInput = styled.input`
  border: none;
  background:transparent;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  font-size: 20px;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #767676;
  }
`;

const InputWrapper = styled.div`
  background:whitesmoke;
  padding: 10px;
  border-radius:10px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1vw;
`;

const EditorArea = styled.div`
  padding: 0px 10px 20px;
`;


const PostQNA = () => {
  const [imageDatas, setimageDatas] = useState([]);
  const [dataValue, setDataValue] = useState({
    memberId: localStorageGetValue('member-id'),
    title: "",
    category: "질문게시판",
    content: "",
    saveEvent: 'N',
  });

  const editorRef = useRef();
  const titleRef = useRef();
  const navigate = useNavigate();

  const TitleReceive = (e) => {
    setDataValue((prevDataValue) => ({
      ...prevDataValue,
      title: e.target.value,
    }));
  };

  const onChange = () => {
    if (editorRef.current) {
      const data = editorRef.current.getInstance().getHTML();
      setDataValue((prevDataValue) => ({
        ...prevDataValue,
        content: data,
      }));
      console.log(data);
    }
  };

  const onUploadImage = async (blob, callback) => {
    let formData = new FormData();
    formData.append("file", blob);
    try {
      // 
      const fileName = await baseAPI.post('/api/upload/temp', formData).then((res) => res.data);
      const url = process.env.REACT_APP_BUCKET_URL
        + "temp/"
        + fileName;

      // 업로드된 블롭을 상태에 추가
      setimageDatas((prevImageData) =>
        [...prevImageData,
        {
          "file": blob,
          "fileName": fileName
        }]);

      // 콜백 함수 호출하여 URL을 에디터에 전달
      callback(url, 'alt text');
    } catch (error) {
      console.error("Image upload failed:", error);
      // 에러 처리 추가
    }

    return false;
  };


  const handleSubmit = async () => {
    let error = validate(dataValue);
    const replacedContent = replaceTempContent(dataValue.content);

    if (Object.keys(error).length === 0) {
      const updatedDataValue = {
        ...dataValue,
        content: replacedContent,
        saveEvent: 'Y',
      };

      try {
        console.log("이미지 링크 바뀌었니?!");
        console.log(updatedDataValue.content);

        const postId = await baseAPI.post("/api/posts", updatedDataValue).then(res => res.data.postId);

        // 실제 저장 용
        await Promise.all(imageDatas.map(imageData => {
          let formData = new FormData();
          formData.append("postId", postId);
          formData.append("file", imageData.file);
          formData.append("fileName", imageData.fileName);

          console.log(imageData.fileName);
          return baseAPI.post("/api/upload/post", formData);
        }));

        navigate(`/post/${postId}`);
      } catch (error) {
        console.error("Post submission failed:", error);
        // 에러 처리 추가
      }
    }
  };

  const stripHtmlTags = (str) => {
    return str.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const replaceTempContent = (str) => {
    const tempUrlPattern = /\/temp\//g;
    const postUrlPattern = '/post/';
    return str.replace(tempUrlPattern, postUrlPattern);

  }

  const validate = (dataValue) => {
    let error = {};
    const strippedTitle = stripHtmlTags(dataValue.title);
    const strippedContents = stripHtmlTags(dataValue.content);

    if (!strippedTitle) {
      error.title = "제목을 입력하세요.";
      alert('제목을 입력하세요.');
    }

    if (!strippedContents) {
      error.content = "내용을 입력 하세요.";
      alert('내용을 입력 하세요.');
    }

    return error;
  };

  return (
    <>
      <Header />
      <Wrapper>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Block></Block>
          <GlassCard>
            <TitleWrapper>
              <h1>질문게시판</h1>
              <h3>제목</h3>
              <InputWrapper>
                <TitleInput
                  type="text"
                  placeholder="제목을 작성해주세요"
                  onChange={TitleReceive}
                  ref={titleRef}
                />
              </InputWrapper>
            </TitleWrapper>
            <TitleWrapper>
              <h3>내용</h3>
            </TitleWrapper>
            <EditorArea>

              <EditorBox ref={editorRef} onChange={onChange} onUploadImage={onUploadImage} />
              <div style={{ display: "flex", justifyContent: "end", margin: '30px 0px 0px 0px' }}>
              <CustomButton type={"submit"} onClick={handleSubmit} width={"100px"}>
                  저장
                </CustomButton>
              </div>
            </EditorArea>
          </GlassCard>
        </div>
      </Wrapper >
    </>
  );
};

export default PostQNA;

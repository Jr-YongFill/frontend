// UpdatePost.js
import React, { useRef, useState } from "react";
import styled from "styled-components";
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { baseAPI } from "../../config";
import Header from "../../components/Header";
import EditorBox from "../../components/posts/EditorBox";
import EditorViewer from "../../components/posts/EditorViewer";
import palette from "../../styles/pallete";
import { useNavigate, useLocation } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  margin: 10px;
  justify-content: center;
  align-content: center;  
`;

const TitleInput = styled.input`
  border: none;
  background: transparent;
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
  background: whitesmoke;
  padding: 10px;
  border-radius: 10px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1vw;
`;

const EditorArea = styled.div`
  padding: 0px 10px 40px;
  .ck.ck-editor__editable:not(.ck-editor__nested-editable) {
    min-height: 600px;
    margin-bottom: 30px;
  }
  .ck.ck-toolbar.ck-toolbar_grouping {
    width: 100%;
  }
  .ck-editor__editable_inline {
    width: 100%;
  }
`;

const SubmitButton = styled.button`
  background: ${palette.skyblue};
  width: 150px;
  height: 60px;
  border-style: none;
  border-radius: 20px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin: 30px 0px;
  cursor: pointer;
`;

const UpdatePost = () => {
  const location = useLocation();
  const { data } = location.state;
  console.log(data);

  const memberId = localStorage.getItem('id');
  const [dataValue, setDataValue] = useState({
    title: data.title,
    category: data.category,
    content: data.content,
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

    }
  };

  const onUploadImage = async (blob, callback) => {
    let formData = new FormData();
    formData.append("file", blob);

    const url = await baseAPI.post('/api/upload/post', formData)
      .then((res) => res.data);

    callback(url, 'alt text');
    return false;
  };

  const handleSubmit = async () => {
    let error = validate(dataValue);

    if (Object.keys(error).length === 0) {
      setDataValue((prevDataValue) => ({
        ...prevDataValue,
        saveEvent: 'Y',
      }));

      const response = await baseAPI.patch(`/api/posts/${memberId}`, dataValue);
      navigate(`/post/${response.data.postId}`);
    }
  };

  const stripHtmlTags = (str) => {
    return str.replace(/<\/?[^>]+(>|$)/g, "");
  };

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
    <div>
      <Header />
      <Wrapper>
        <div>
          <TitleWrapper>
            <h1>정보게시판</h1>
            <h3>제목</h3>
            <InputWrapper>
              <TitleInput
                type="text"
                defaultValue={dataValue.title}
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
            <EditorBox ref={editorRef} onChange={onChange} onUploadImage={onUploadImage} initialValue={dataValue.content}/>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <SubmitButton onClick={handleSubmit}>
                저장
              </SubmitButton>
            </div>
          </EditorArea>
        </div>
      </Wrapper>
      <EditorViewer contents={dataValue.content} />
    </div>
  );
};

export default UpdatePost;

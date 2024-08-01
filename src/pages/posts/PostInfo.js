import React, { useRef, useState } from "react";
import styled from "styled-components";
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import Header from "../../components/Header";
import EditorBox from "../../components/posts/EditorBox";
import EditorViewer from "../../components/posts/EditorViewer";
import palette from "../../styles/pallete";
import { useNavigate } from "react-router-dom";
import { baseAPI } from "../../config";
import { localStorageGetValue } from "../../utils/CryptoUtils";

const Wrapper = styled.div`
  display: flex;
  margin: 10px;
  justify-content: center;
  align-content: center;  
`;

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
  background:${palette.skyblue};
  width: 150px;
  height: 60px;
  border-style:none;
  border-radius: 20px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin: 30px 0px;;
  cursor:pointer;
`;

const PostQNA = () => {
  const [blobs, setBlobs] = useState([]);
  const [dataValue, setDataValue] = useState({
    memberId: localStorageGetValue('member-id'),
    title: "",
    category: "정보게시판",
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
        const url = process.env.REACT_APP_BUCKET_URL
        +"temp/"
        + await baseAPI.post('/api/upload/temp', formData).then((res) => res.data);

        // 업로드된 블롭을 상태에 추가
        setBlobs((prevBlobs) => [...prevBlobs, blob]);

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

    if (Object.keys(error).length === 0) {
      setDataValue((prevDataValue) => ({
        ...prevDataValue,
        saveEvent: 'Y',
      }));

      try {
        const postId = await baseAPI.post("/api/posts", dataValue).then(res => res.data.postId);

        // 실제 저장 용
        await Promise.all(blobs.map(blob => {
          let formData = new FormData();
          formData.append("postId", postId);
          formData.append("file", blob);
          formData.append("fileName", blob.fileName);
          baseAPI.post("/api/upload/post", formData);
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

export default PostQNA;

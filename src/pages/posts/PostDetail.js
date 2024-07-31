// PostDetail.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import { baseAPI } from '../../config';
import styled from 'styled-components';
import EditorViewer from '../../components/posts/EditorViewer';
import CustomButton from '../../components/CustomButton';
import palette from '../../styles/pallete';

/* data객체 정보 예시
{
    "postId": 1,
    "title": "제목 초안 2",
    "category": "정보게시판",
    "content": "내용 초안2",
    "writerName": "이동규",
    "createTime": "2024-07-26T12:35:01.382685",
    "lastUpdateTime": "2024-07-30T09:12:16.439996",
    "likeCount": 2,
    "viewCount": 4,
    "updateYn": "N",
    "filePath": "default_profile_image.jpg",
    "liked": false
}
*/
const Container = styled.div`

  display:flex;
  flex-direction:column;

`

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

function PostDetail() {
  const { id } = useParams();
  const [data,setData] = useState(null);
  const [isDone,setDone] = useState(false);
  const navigate= useNavigate();

  const handleSubmit = () => {
    navigate("/post/update", { state: { data } });
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await baseAPI.get(`/api/posts/${id}`);
        setData(response.data);
        setDone(true);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]); // 빈 배열을 추가하여 컴포넌트가 처음 마운트될 때만 호출되도록 설정


  console.log(data);

  return (
    <div>
      <Header/>
      <Wrapper>
        <Container>
          <h1>글제목: {isDone ? data.title : '로딩중...'}</h1>
          <hr></hr>
          <h4>글쓴이: {isDone ? data.writerName : '로딩중'}</h4>
          <hr></hr>
          <h2>내용: {isDone? <EditorViewer contents={data.content}></EditorViewer>:"로딩중..."}</h2>
          <SubmitButton onClick={handleSubmit}>
            수정
          </SubmitButton>
        </Container>
        
      </Wrapper>
    </div>
  );
}

export default PostDetail;

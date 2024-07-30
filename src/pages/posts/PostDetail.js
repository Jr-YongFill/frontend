// PostDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import { baseAPI } from '../../config';

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


function PostDetail() {
  const { id } = useParams();
  const [data,SetData] = useState();
  
  useEffect(()=>{
    const response= baseAPI.get(`/api/posts/${id}`);
    SetData(response);
  },[id])

  return (
    <div>
      <Header></Header>
      <Wrapper>
        <h1>{data.title}</h1>
        <p>{data.content}</p>
      </Wrapper>
    </div>
  );
}

export default PostDetail;

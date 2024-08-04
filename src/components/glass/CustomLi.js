import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { baseAPI } from "../../config";

const Container = styled.li`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  list-style: none;
  padding: 3px 0px;
  cursor: pointer;
`;

const MultiLineEllipsisText = styled.div`
  width:; 80%
  font-size: 1em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  
`;

const CustomLi = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      console.log(data.postId);
      const response = await baseAPI.get(`api/posts/${data.postId}`);
      navigate(`/post/${data.postId}`);
    } catch (error) {
      alert("삭제된 게시글입니다.");
      window.location.reload(); //새로고침

    }
  };

  return (
    <Container onClick={handleClick}>
      <MultiLineEllipsisText>{data.title}</MultiLineEllipsisText>
      <div style={{ fontSize: 10, width:"20%",textAlign:"right"}}>{data.writerName}</div>
    </Container>
  );
};

export default CustomLi;

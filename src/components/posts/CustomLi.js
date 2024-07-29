import React from 'react';
import styled from 'styled-components';

const Container = styled.li`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  list-style: none;
  padding:3px 0px;
  cursor:pointer;
`

const CustomLi = ({ data }) => {
  const handleClick = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL || ''; // 환경 변수에서 baseUrl 가져오기
    window.location.href = `${baseUrl}/api/posts/${data.postId}`;
  };

  return (
    
    <Container onClick={handleClick}>
      <div style={{fontSize:16}}>{data.title}</div>
      <div style={{fontSize:10}}>{data.writerName}</div>
    </Container>
  );
};

export default CustomLi;

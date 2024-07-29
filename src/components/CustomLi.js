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
    window.location.href = `/api/posts/${data.postId}`;
  };

  return (
    
    <Container onClick={handleClick}>
      <div style={{fontSize:16}}>{data.title}</div>
      <div style={{fontSize:10}}>{data.writerName}</div>
    </Container>
  );
};

export default CustomLi;

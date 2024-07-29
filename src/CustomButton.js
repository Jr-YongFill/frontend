import React from 'react';
import styled from 'styled-components';

const MyBtn = styled.button`
  background-color: ${(props) => props.color || 'blue'}; /* 기본 색상 설정 */
  border: none;
  width: 300px;
  height: 100px;
  border-radius: 20px;
  font-size: 30px;
  font-weight: bold;
  color: white;
  margin: 30px;
`;

const CustomButton = ({ color, children }) => {
  return (
    <MyBtn color={color}>
      {children}
    </MyBtn>
  );
};

export default CustomButton;

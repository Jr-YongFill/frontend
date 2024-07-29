import React from 'react';
import styled from 'styled-components';

const MyBtn = styled.button`
  background-color: ${(props) => props.color || 'blue'}; /* 기본 색상 설정 */
  border: none;
  width: 150px;
  height: 60px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin: 30px;
  cursor:pointer;
`;


const CustomButton = ({ color, children, onClick }) => {
    return (
      <MyBtn color={color} onClick={onClick}>
        {children}
      </MyBtn>
    );
  };
export default CustomButton;

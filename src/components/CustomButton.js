import React from 'react';
import styled from 'styled-components';
import palette from '../styles/pallete';

const MyBtn = styled.button`
  background-color: ${(props) => props.color || palette.dark}; /* 기본 색상 설정 */
  border: none;
  width: ${(props) => props.width || '10vw'};
  height: 5vh;
  border-radius: 40px;
  font-size: 1em;
  font-weight: bold;
  color: white;
  cursor:pointer;
  padding: 10px;
  type:${props => props.type || 'submit'}

  ${(props) => props.isNotHover ?
    null
    :
    `&:hover{
      background-color:${palette.purple}
    }`} 
`;


const CustomButton = ({ color, children, onClick, width, myRef, isNotHover, type}) => {
  return (
    <MyBtn ref={myRef} color={color} onClick={onClick} width={width} isNotHover={isNotHover}  type={type}>
      {children}
    </MyBtn>
  );
};
export default CustomButton;



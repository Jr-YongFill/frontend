import React from 'react';
import styled from 'styled-components';
import palette from '../styles/pallete';



const MyBtn = styled.button.attrs(props => ({
  type: props.type || 'button', // 기본 type을 text로 설정
}))`
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

  ${(props) => props.isNotHover ?
    null
    :
    `&:hover{
      background-color:${palette.purple}
    }`} 
`;


const CustomButton = ({ color, children, onClick, width, myRef, isNotHover, type, disabled }) => {
  return (
    <MyBtn ref={myRef} color={color} onClick={onClick} width={width} disabled={disabled} isNotHover={isNotHover} type={type} >
      {children}
    </MyBtn>
  );
};
export default CustomButton;



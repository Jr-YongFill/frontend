import React from 'react';
import styled from 'styled-components';
import palette from '../styles/pallete';



const InputField = styled.input`
  background-color: ${(props) => props.color || palette.dark }; /* 기본 색상 설정 */
  border: none;
  width: ${(props) => props.width || '10vw' };
  height: 5vh;
  border-radius: 40px;
  font-size: 1em;
  font-weight: bold;
  color: white;
  cursor:pointer;
  padding: 10px;
`;


const CustomInput = ({ type, children, onChange, placeholder }) => {
  return (
    <InputField type={type} onChange={onChange} placeholder={placeholder}>
      {children}
    </InputField>
  );
};
export default CustomInput;

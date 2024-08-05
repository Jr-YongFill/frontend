import React, { useState } from 'react';
import styled from 'styled-components';
import palette from '../styles/pallete';

const MyBtn = styled.button.attrs(props => ({
  type: props.type || 'button' // 기본 type을 text로 설정
}))`
  background-color: ${(props) => props.color || palette.dark}; /* 기본 색상 설정 */
  border: none;
  width: ${(props) => props.width || 'auto'};
  padding: 0 10px;
  height: 5vh;
  border-radius: 10px;
  font-size: 1em;
  color: white;
  cursor: pointer;
  text-align: center;
  margin: 10px 0;

  ${(props) => props.isNotHover ?
    null
    :
    `&:hover {
      background-color: ${palette.purple}
    }`}

  &:disabled {
    cursor: not-allowed;
    background-color: ${palette.gray}; // 비활성화된 상태일 때의 색상
  }
`;

const DisposableButton = ({ color, children, onClick, width, myRef, isNotHover, type }) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setIsDisabled(true);
  };

  return (
    <MyBtn
      ref={myRef}
      color={color}
      onClick={handleClick}
      width={width}
      disabled={isDisabled}
      isNotHover={isNotHover}
      type={type}
    >
      {children}
    </MyBtn>
  );
};

export default DisposableButton;

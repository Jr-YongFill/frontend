import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import palette from '../styles/pallete';

const TimerComponent = styled.div`
    background:${palette.skyblue};
    color: white;
    font-size:10rem;
    width:20vw;
    text-align:center;
    padding-bottom:2vw;
    border-radius:20px;
    min-width: 300px;
`;

const Timer = (props) => {
  const [seconds, setSeconds] = useState(10);

  // 메모이제이션된 timeOut 함수
  const timeOut = useCallback(() => {
    setSeconds(0);
    props.handleNext();
    // props.timeOut((prev)=>prev+1); 문제 인덱스 1 추가
  }, [props.handleNext]);

  useEffect(() => {
    if (seconds >= 0) {
      const timer = setInterval(() => setSeconds(prev => prev - 1), 1000);
      return () => clearInterval(timer);  // clearInterval이 아니라 clearTimeout입니다
    } else {
      // seconds가 0이 될 경우 timeOut 호출
      timeOut();
    }
  }, [seconds, timeOut]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <TimerComponent>
      <div>{formatTime(seconds)}</div>
    </TimerComponent>
  );
};

export default Timer;

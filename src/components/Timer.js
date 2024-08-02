import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import palette from '../styles/pallete';


const TimerComponent = styled.div`
  background:${palette.skyblue};
  color: white;
  font-size:10rem;
  width:20vw;
  text-align:center;
  padding-bottom:2vw;

`


//TimerPage에 setQuestionIdx라는 함수가 있다면.... 
//<Timer timeOut= {setQuestionIdx} ></Timer>라는 식으로 삽입 후

const Timer = (props) => {
  const [seconds, setSeconds] = useState(120);

  const timeOut = () => {
    setSeconds(0);
    alert('넘어가세요~');
    // props.timeOut((prev)=>prev+1); 문제 인덱스 1 추가
  }

  useEffect(() => {

    if (seconds >= 0) {
      const timer = setInterval(() => setSeconds(seconds - 1), 1000);
      return() => clearTimeout(timer);
    }else{
      //0이 될 경우
      timeOut();
    }
  }, [seconds]);

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
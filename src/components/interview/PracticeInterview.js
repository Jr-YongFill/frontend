import React, {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Header from '../Header';
import {baseAPI} from "../../config";
import axios from "axios";

const PracticeInterview = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  const location = useLocation();
  const { stackids, apiKey } = location.state || {};
  const [questions, setQuestions] = useState([]);

  const fetchQuestions = useCallback(async () => {
    if (!stackids || stackids.length === 0) {
      console.warn('No stack IDs provided.');
      return;
    }

    try {
      const params = new URLSearchParams();
      stackids.forEach(id => params.append('stack_id', id));
      params.append('size', '1');

      const response = await baseAPI.get(`/api/questions?${params.toString()}`);
      setQuestions(response.data);
      console.log(response.data); // Updated to log response.data directly
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  }, [stackids]); // stackids가 변경될 때만 재생성

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]); // fetchQuestions을 의존성 배열에 추가






  return (
      <div>
      <Header />
      <h2>연습 면접</h2>
      {stackids.map(id => (
        <h2> Stack ID: {id}</h2>
      ))}
      <h2>apiKey : {apiKey}</h2>
        {questions.map(q => (
          <h2> Question: {q.question}</h2>
        ))}
      <button onClick={() => navigate('/interview/result')}>면접 결과</button>
    </div>
  );
};

export default PracticeInterview;

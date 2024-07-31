import React, {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Header from '../../components/Header';
import {baseAPI} from "../../config";

const Interview = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  const location = useLocation();
  const { stackids, apiKey } = location.state || {};
  const [questions, setQuestions] = useState([]);


  const fetchQuestions = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      stackids.forEach(id => params.append('stack_id', id));
      params.append('size', '10');

      const response = await baseAPI.get(`/api/questions?${params.toString()}`);
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  }, [stackids]);

  useEffect(() => {
      fetchQuestions();
  }, [fetchQuestions]);

  return (
    <div>
      <Header />
      <h2>실전 면접</h2>
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

export default Interview;

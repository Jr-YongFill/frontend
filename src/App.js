import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Member from './components/Member';
import Signin from './components/auth/Signin';
import Signup from './components/auth/Signup';
import ChoiceInterviewMode from './components/interview/ChoiceInterviewMode';
import Interview from './components/interview/Interview';
import InterviewChoiceStack from './components/interview/InterviewChoiceStack';
import InterviewMain from './components/interview/InterviewMain';
import InterviewNote from './components/interview/InterviewNote';
import InterviewResult from './components/interview/InterviewResult';
import PracticeChoiceStack from './components/interview/PracticeChoiceStack';
import PracticeInterview from './components/interview/PracticeInterview';
import PracticeInterviewMain from './components/interview/PracticeInterviewMain';
import InfoPost from './components/posts/InfoPost';
import Post from './components/posts/Post';
import QnAPost from './components/posts/QnAPost';
import UpdatePost from './components/posts/UpdatePost';
import Community from './components/Community';
import Home from './components/Home';
import Store from './components/Store';
import Vote from './components/Vote';
import Header from './components/Header'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/member" element={<Member />} />
          <Route path="/auth/signin" element={<Signin />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/interview/choice-mode" element={<ChoiceInterviewMode />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/interview/choice-stack" element={<InterviewChoiceStack />} />
          <Route path="/interview/main" element={<InterviewMain />} />
          <Route path="/interview/note" element={<InterviewNote />} />
          <Route path="/interview/result" element={<InterviewResult />} />
          <Route path="/interview/practice-choice-stack" element={<PracticeChoiceStack />} />
          <Route path="/interview/practice" element={<PracticeInterview />} />
          <Route path="/interview/practice-main" element={<PracticeInterviewMain />} />
          <Route path="/post/info" element={<InfoPost />} />
          <Route path="/post" element={<Post />} />
          <Route path="/post/qna" element={<QnAPost />} />
          <Route path="/post/update" element={<UpdatePost />} />
          <Route path="/community" element={<Community />} />
          <Route path="/store" element={<Store />} />
          <Route path="/vote" element={<Vote />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

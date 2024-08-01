import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Member from './pages/Member';
import Signin from './pages/auth/Signin';
import Signup from './pages/auth/Signup';
import ChoiceInterviewMode from './pages/interview/ChoiceInterviewMode';
import InterviewChoiceStack from './pages/interview/InterviewChoiceStack';
import InterviewMain from './pages/interview/InterviewMain';
import InterviewResult from './pages/interview/InterviewResult';
import PracticeChoiceStack from './pages/interview/PracticeChoiceStack';
import PracticeInterview from './pages/interview/PracticeInterview';
import PracticeInterviewMain from './pages/interview/PracticeInterviewMain';
import CommunityMain from './pages/community/CommunityMain';
import CommunityInfo from './pages/community/CommunityInfo';
import CommunityQNA from './pages/community/CommunityQNA';
import UpdatePost from './pages/posts/UpdatePost';
import WritePost from './pages/posts/WritePost';
import Store from './pages/Store';
import Vote from './pages/Vote';
import Interview from './pages/interview/Interview';
import InterviewNote from './pages/interview/InterviewNote';
import PostDetail from './pages/posts/PostDetail';
import PostQNA from './pages/posts/PostQNA';
import PostInfo from './pages/posts/PostInfo';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/member" element={<Member />} />
          <Route path="/auth/sign-in" element={<Signin />} />
          <Route path="/auth/sign-up" element={<Signup />} />

          <Route path="/interview/choice-mode" element={<ChoiceInterviewMode />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/interview/choice-stack" element={<InterviewChoiceStack />} />
          <Route path="/interview/main" element={<InterviewMain />} />
          <Route path="/interview/note" element={<InterviewNote />} />
          <Route path="/interview/result" element={<InterviewResult />} />

          <Route path="/interview/practice-choice-stack" element={<PracticeChoiceStack />} />
          <Route path="/interview/practice" element={<PracticeInterview />} />
          <Route path="/interview/practice-main" element={<PracticeInterviewMain />} />

          <Route path="/community/main" element={<CommunityMain/>} />
          <Route path="/community/info" element={<CommunityInfo />} />
          <Route path="/community/qna" element={<CommunityQNA/>} />

          <Route path="/post/:id" element={<PostDetail/>} />
          <Route path="/post/update" element={<UpdatePost/>}/>
          <Route path="/post/qna/write" element={<PostQNA/>}/>
          <Route path="/post/info/write" element={<PostInfo/>}/>
          
          <Route path="/store" element={<Store/>} />
          <Route path="/vote" element={<Vote/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Member from './pages/Member';
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
import Home from './pages/Home';
import Store from './pages/Store';
import Vote from './pages/Vote';
import Community from './pages/posts/Community';
import CommunityWrite from './pages/posts/CommunityWrite';
import QnAPost from './pages/posts/QnAPost';
import Post from './pages/posts/Post';
import UpdatePost from './pages/posts/UpdatePost';
import InfoPost from './pages/posts/InfoPost';

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

          <Route path="/community/main" element={<Community />} />
          <Route path="/community/info" element={<InfoPost />} />
          <Route path="/community/qna" element={<QnAPost/>} />

          <Route path="/post" element={<Post></Post>} />
          <Route path="/post/update" element={<UpdatePost/>}></Route>
          <Route path="/post/write" element={<CommunityWrite/>}></Route>
          
          <Route path="/store" element={<Store />} />
          <Route path="/vote" element={<Vote />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

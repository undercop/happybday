// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Memories from './pages/Memories';
import Wishes from './pages/Wishes';
import Surprise from './pages/Surprise';
import NotFound from './pages/NotFound';
import CatSmirk from './pages/CatSmirk';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/wishes" element={<Wishes />} />
          <Route path="/surprise" element={<Surprise />} />
          <Route path="/cat-smirk" element={<CatSmirk />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
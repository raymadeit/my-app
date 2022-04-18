import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"
import Questions from './Components/Questions'
import About from './Views/About'

function App() {
  return (
    <div className="relative pb-10 min-h-screen">
      <Router>

        <div className="p-3">
          <Routes>
            <Route path="/" element={<Questions />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>

      </Router>
    </div>
  );
}

export default App;

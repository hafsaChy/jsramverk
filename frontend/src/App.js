import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DelayedTrainPage from "./pages/DelayedTrainPage";


function App() {
  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<DelayedTrainPage />}>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

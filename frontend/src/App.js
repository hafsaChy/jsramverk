import React from 'react';
import './styles/App.css';
import MainView from './components/MainView';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/LoginView";
import Register from "./components/RegisterView";

function App() {  
  return (
    <div className="App">
      <header className="App-header">
        TågInfo Kontroll App
      </header>
      <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app" element={<MainView />} />
        </Routes>
      </BrowserRouter>    
      </div>
    </div> 
  );
}

export default App;

import React from 'react';
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import DelayTableView from './components/DelayTableView';
import MapView from './components/MapView';

function App() {
  
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          TågInfo Kontroll App
        </header>
        <div className="container">
          <DelayTableView />
          <MapView />
        </div>
      </div>    
    </Router>
  );
}

export default App;

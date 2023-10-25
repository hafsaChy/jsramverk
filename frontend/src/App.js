import React from 'react';
import "./App.css";
// import { BrowserRouter as Router } from "react-router-dom";
// import DelayTableView from './components/DelayTableView';
// import MapView from './components/MapView';
import MainView from './components/MainView';
import { withRouter } from "./utils";

function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        TågInfo Kontroll App
      </header>
      <div className="container">
      
        <MainView /> 
      
      </div>
    </div> 
  );
}

export default withRouter(App);

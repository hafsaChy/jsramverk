import React from 'react';
import './../App.css';
import MainView from '../components/MainView.js'

export default function DelayedTrainPage() {
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


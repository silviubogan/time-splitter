import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { Howl, Howler } from 'howler';
import 'semantic-ui-css/semantic.min.css';
import { MainForm } from './MainForm';
import { Button } from 'semantic-ui-react';

export const sound = new Howl({
  src: ['service-bell_daniel_simion.mp3'],
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Time Splitter
        </h1>
      </header>
      <main>
        <MainForm />
      </main>
      <footer>
        <Button onClick={() => {
          localStorage.clear();
        }}
        >
          Clear all data
        </Button>
      </footer>
    </div>
  );
}

export default App;

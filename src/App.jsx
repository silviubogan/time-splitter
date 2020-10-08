import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { Howl, Howler } from 'howler';
import 'semantic-ui-css/semantic.min.css';
import { Form } from './Form';

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
        <Form />
      </main>
      <footer>
        <button onClick={() => {
          localStorage.clear();
        }}
        >
          Clear all data
        </button>
      </footer>
    </div>
  );
}

export default App;

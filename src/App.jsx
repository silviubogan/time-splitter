import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Piece from './Piece';
import { intToTimeString, timeStringToInt } from './utils';

const Bar = ({ pieces, onPiecesChange, startTime }) => (
  <div>
    <button onClick={() => {
      onPiecesChange([...pieces, { text: '', startMinute: -1 }]);
    }}
    >
      Add new piece
    </button>

    <div className="bar">
      {pieces.map((p, i) => (
        <Piece
          index={i}
          doDelete={() => {
            onPiecesChange(pieces.filter((x) => x !== p));
          }}
          doMoveDown={() => {
            const arr = [...pieces];
            const aux = pieces[pieces.indexOf(p)];
            arr[pieces.indexOf(p)] = arr[pieces.indexOf(p) - 1];
            arr[pieces.indexOf(p) - 1] = aux;
            onPiecesChange(arr);
          }}
          doMoveUp={() => {
            const arr = [...pieces];
            const aux = arr[pieces.indexOf(p) - 1];
            arr[pieces.indexOf(p) - 1] = arr[pieces.indexOf(p)];
            arr[pieces.indexOf(p)] = aux;
            onPiecesChange(arr);
          }}
          onChange={(val) => {
            const arr = [...pieces];
            arr[arr.indexOf(p)] = {
              ...val,
            };
            onPiecesChange(arr);
          }}
          value={p}
          startTime={startTime}
        />
      ))}
    </div>
  </div>
);

// TODO: reordering does not work

const Form = ({ ...rest }) => {
  const [startTime, setStartTime] = React.useState(localStorage.getItem('startTime'));
  const [totalPauseDuration, setTotalPauseDuration] = React.useState(localStorage.getItem('totalPauseDuration') || 0);
  const [endTime, setEndTime] = React.useState(localStorage.getItem('endTime'));
  const [pieces, setPieces] = React.useState(JSON.parse(localStorage.getItem('data')) || []);
  const [output, setOutput] = React.useState('');
  const [totalTime, setTotalTime] = React.useState(0);

  const notify = React.useCallback((txt) => {
    if (Notification.permission === 'granted') {
      // If it's okay let's create a notification
      const notification = new Notification(txt);
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === 'granted') {
          const notification = new Notification(txt);
        }
      });
    }
  }, []);

  const interval = React.useRef(null);
  React.useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current);
    }
    interval.current = setInterval(() => {
      const d = new Date();
      const m = d.getMinutes();
      const s = d.getSeconds();
      pieces.forEach((p, i) => {
        if (s === 0 && intToTimeString(p.startMinute, startTime) === `${d.getHours()}:${m < 10 ? `0${m}` : m}`) {
          notify(`Hey! ${i % 2 === 1 ? 'Time to open your eyes.' : 'Time to work.'} ${p.text}`);
        }
      });
    }, 1000);
  }, [pieces]);

  return (
    <div>
      <label>
        Start:
        <input
          type="time"
          onChange={(val) => {
            setStartTime(val.target.value);
            localStorage.setItem('startTime', val.target.value);
          }}
          value={startTime}
        />
      </label>
      <label>
        End:
        <input
          type="time"
          onChange={(val) => {
            setEndTime(val.target.value);
            localStorage.setItem('endTime', val.target.value);
          }}
          value={endTime}
        />
      </label>
      <label>
        Total Pause Duration:
        <input
          type="time"
          onChange={(val) => {
            setTotalPauseDuration(val.target.value);
            localStorage.setItem('totalPauseDuration', val.target.value);
          }}
          value={totalPauseDuration}
        />
      </label>
      <Bar
        pieces={pieces}
        onPiecesChange={(ps) => {
          setPieces(ps);
          localStorage.setItem('data', JSON.stringify(ps));
        }}
        startTime={startTime}
      />
      <button onClick={() => {
        if (typeof startTime === 'number' || typeof endTime === 'number') {
          alert('Error: invalid times selected');
          return;
        }
        const minutes = timeStringToInt(endTime) - timeStringToInt(startTime);
        setTotalTime(`${(minutes / 60).toString()} h`);

        // const perPiece = minutes / pieces.length;

        const np = [...pieces];

        const intTotalPauseDuration = timeStringToInt(totalPauseDuration);
        const pauseCount = np.length / 2;
        const pauseDuration = intTotalPauseDuration / pauseCount;

        const totalWorkDuration = minutes - intTotalPauseDuration;
        const workCount = np.length / 2;
        const normalDuration = totalWorkDuration / workCount;

        let crtIdx = 0;
        let crtMin = 0;
        while (true) {
          np[crtIdx].startMinute =/*  timeStringToInt(startTime) +  */crtMin;
          const duration = crtIdx % 2 === 1 ? pauseDuration : normalDuration;

          np[crtIdx].endMinute = np[crtIdx].startMinute + duration;

          // debugger;

          crtMin += duration;

          ++crtIdx;
          if (crtIdx >= np.length) {
            break;
          }
        }

        setPieces(np.map((x) => ({ ...x })));

        // debugger;

        setOutput(`Done at ${new Date().toLocaleString()}`);
      }}
      >
        Compute times
      </button>
      <p>
        <em>{output}</em>
        <br />
        Total time:
        <strong>{totalTime}</strong>
      </p>
    </div>
  );
};

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

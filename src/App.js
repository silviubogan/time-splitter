import React from 'react';
// import logo from './logo.svg';
import './App.css';

/**
 * time string to minutes count
 * @param {*} s
 */
const timeStringToInt = (s) => {
  const [p1, p2] = s.split(':');
  return parseInt(p1) * 60 + parseInt(p2);
};

const intToTimeString = (x, baseTime) => {
  if (baseTime) {
    let y = timeStringToInt(baseTime);
    let h = (y / 60);
    let m = (y % 60);

    h += x / 60;
    m += x % 60;

    // debugger;
    if (m / 60 >= 1) {
      ++h;
      m -= 60;
    }

    h = Math.floor(h).toFixed(0);
    m = Math.floor(m).toFixed(0);

    const mm = m < 10 ? '0' + m : m;

    return h + ':' + mm;
  }

  const h = (x / 60).toFixed(0);
  const m = (x % 60).toFixed(0);

  const mm = m < 10 ? '0' + m : m;

  return h + ':' + mm;
};

const Piece = ({doDelete, doMoveUp, doMoveDown, onChange, value, startTime}) => {
  const [editing, setEditing] = React.useState(false);

  return (<div className="piece">
    <button onClick={doDelete}>&times;</button>
    <button onClick={doMoveUp}>Up</button>
    <button onClick={doMoveDown}>Down</button>
<p><em>Time:</em> {value.startMinute > -1 ? intToTimeString(value.startMinute, startTime) : intToTimeString(0, startTime)}</p>

    {editing ? (
      <>
        <button onClick={() => {
          setEditing(false);
        }}>Back</button>
        <input type="text" placeholder="Type here..." value={value.text} onChange={(ev) => {
          onChange({ text: ev.target.value });
        }}/>
      </>
      ) : (
        <>
       <button onClick={() => {
         setEditing(true);
       }}>Edit</button>
      <p>{value.text.length > 0 ? value.text : (<em>Empty</em>)}</p>
      </>
    )}
  </div>);
};

const Bar = ({pieces, onPiecesChange, startTime}) => {

  return (<div>
    <button onClick={() => {
      onPiecesChange([...pieces, {text: '', startMinute: -1}]);
    }}>Add new piece</button>

    <div className="bar">
    {pieces.map((p) => {
      return (<Piece doDelete={() => {
        onPiecesChange(pieces.filter((x) => x !== p));
      }} doMoveDown={() => {
        const arr = [...pieces];
        const aux = pieces[pieces.indexOf(p)];
        arr[pieces.indexOf(p)] = arr[pieces.indexOf(p) - 1];
        arr[pieces.indexOf(p) - 1] = aux;
        onPiecesChange(arr);
      }} doMoveUp={() => {
        const arr = [...pieces];
        const aux = arr[pieces.indexOf(p) - 1];
        arr[pieces.indexOf(p) - 1] = arr[pieces.indexOf(p)];
        arr[pieces.indexOf(p)] = aux;
        onPiecesChange(arr);
      }} onChange={(val) => {
        const arr = [...pieces];
        arr[arr.indexOf(p)] = {
          ...val
        };
        onPiecesChange(arr);
      }} value={p} startTime={startTime}></Piece>);
    })}
    </div>
  </div>);
};

// TODO: reordering does not work

const Form = ({ ...rest }) => {
  const [startTime, setStartTime] = React.useState(localStorage.getItem('startTime'));
  const [totalPauseDuration, setTotalPauseDuration] = React.useState(localStorage.getItem('totalPauseDuration') || 0);
  const [endTime, setEndTime] = React.useState(localStorage.getItem('endTime'));
  const [pieces, setPieces] = React.useState(JSON.parse(localStorage.getItem('data')) || []);
  const [output, setOutput] = React.useState('');
  const [totalTime, setTotalTime] = React.useState(0);

  return <div>
    <label>
      Start:
    <input type="time" onChange={(val) => {
      setStartTime(val.target.value);
      localStorage.setItem('startTime', val.target.value);
    }} value={startTime}></input>
    </label>
    <label>
      End:
    <input type="time" onChange={(val) => {
      setEndTime(val.target.value);
      localStorage.setItem('endTime', val.target.value);
    }} value={endTime}></input>
    </label>
    <label>
      Total Pause Duration:
    <input type="time" onChange={(val) => {
      setTotalPauseDuration(val.target.value);
      localStorage.setItem('totalPauseDuration', val.target.value);
    }} value={totalPauseDuration}></input>
    </label>
    <Bar pieces={pieces} onPiecesChange={(ps) => {
      setPieces(ps);
      localStorage.setItem('data', JSON.stringify(ps));
    }} startTime={startTime}></Bar>
    <button onClick={() => {
      if (typeof startTime === 'number' || typeof endTime === 'number') {
        alert('Error: invalid times selected');
        return;
      }
      const minutes = timeStringToInt(endTime) - timeStringToInt(startTime);
      setTotalTime((minutes / 60).toString() + ' h');

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

      setPieces(np.map(x => {
        return {...x};
      }));

      // debugger;

      setOutput('Done at ' + new Date().toLocaleString());
    }}>Compute times</button>
    <p><em>{output}</em><br/>Total time: <strong>{totalTime}</strong></p>
  </div>;
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
        }}>Clear all data</button>
      </footer>
    </div>
  );
}

export default App;

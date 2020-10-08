import React from 'react';
import { intToTimeString, timeStringToInt, getCurrentTimeString } from './utils';
import { Bar } from './Bar';
import { sound } from './App';
import { Button, Input, Form, Message } from 'semantic-ui-react';

// TODO: reordering does not work
export const MainForm = ({ ...rest }) => {
  const [startTime, setStartTime] = React.useState(localStorage.getItem('startTime'));
  const [totalPauseDuration, setTotalPauseDuration] = React.useState(localStorage.getItem('totalPauseDuration') || '0:00');
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
      const cts = getCurrentTimeString();
      pieces.forEach((p, i) => {
        const s = new Date().getSeconds();
        if (s === 0 && intToTimeString(p.startMinute, startTime) === cts) {
          sound.play();
          notify(`Hey! ${i % 2 === 1 ? 'Time to open your eyes.' : 'Time to work.'} ${p.text}`);
        }
      });
    }, 1000);
  }, [pieces]);

  const computeTimes = React.useCallback(() => {
    if (typeof startTime === 'number' || typeof endTime === 'number') {
      alert('Error: invalid times selected');
      return;
    }
    const minutes = timeStringToInt(endTime) - timeStringToInt(startTime);
    setTotalTime(`${(minutes / 60).toString()} h`);

    if (pieces.length === 0) {
      setOutput(`Nothing to do at ${new Date().toLocaleString()}`);
      return;
    }

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
      np[crtIdx].startMinute = /*  timeStringToInt(startTime) +  */ crtMin;
      const duration = crtIdx % 2 === 1 ? pauseDuration : normalDuration;

      np[crtIdx].endMinute = np[crtIdx].startMinute + duration;

      crtMin += duration;

      ++crtIdx;
      if (crtIdx >= np.length) {
        break;
      }
    }

    setPieces([...np]);
    setOutput(`Done at ${new Date().toLocaleString()}`);
  });

  return (<>
    <Form size="large">
      <Form.Group widths="equal">
        <Form.Input fluid label="Start" type="time" value={startTime}
              onChange={(val) => {
                setStartTime(val.target.value);
                localStorage.setItem('startTime', val.target.value);
              }} />
        <Form.Input fluid label="End" type="time"
          onChange={(val) => {
            setEndTime(val.target.value);
            localStorage.setItem('endTime', val.target.value);
          }}
          value={endTime} />
        <Form.Input fluid label="Total Pause Duration"
          type="time"
          onChange={(val) => {
            setTotalPauseDuration(val.target.value.toString());
            localStorage.setItem('totalPauseDuration', val.target.value.toString());
          }}
          value={totalPauseDuration} />
        </Form.Group>
        </Form>
      <Bar
        pieces={pieces}
        onPiecesChange={(ps) => {
          setPieces(ps);
          localStorage.setItem('data', JSON.stringify(ps));
        }}
        startTime={startTime} />
      <Button onClick={computeTimes}>
        Compute times
      </Button>
      <Message success header={output} content={`Total time: ${totalTime}`}/>
    </>
  );
};

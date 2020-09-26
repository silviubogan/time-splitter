import React from 'react';
import { intToTimeString, timeStringToInt } from './utils';

const Piece = ({
  doDelete, doMoveUp, doMoveDown, onChange, value, startTime, index,
}) => {
  const [editing, setEditing] = React.useState(false);

  return (
    <div className="piece">
      {index % 2 === 0 && (
      <h2>
        {index / 2 + 1}
        .
      </h2>
      )}
      <button onClick={doDelete}>&times;</button>
      <button onClick={doMoveUp}>Up</button>
      <button onClick={doMoveDown}>Down</button>
      <p>
        <em>Time:</em>
        {' '}
        {value.startMinute > -1 ? intToTimeString(value.startMinute, startTime) : intToTimeString(0, startTime)}
      </p>

      {editing ? (
        <>
          <button onClick={() => {
            setEditing(false);
          }}
          >
            Back
          </button>
          <input
            type="text"
            placeholder="Type here..."
            value={value.text}
            onChange={(ev) => {
              onChange({ text: ev.target.value });
            }}
          />
        </>
      ) : (
        <>
          <button onClick={() => {
            setEditing(true);
          }}
          >
            Edit
          </button>
          <p>{value.text.length > 0 ? value.text : (<em>Empty</em>)}</p>
        </>
      )}
    </div>
  );
};

export default Piece;

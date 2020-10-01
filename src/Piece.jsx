import React from 'react';
import { intToTimeString, timeStringToInt } from './utils';
import { Button, Segment } from 'semantic-ui-react';

const Piece = ({
  doDelete, doMoveUp, doMoveDown, onChange, value, startTime, index,
}) => {
  const [editing, setEditing] = React.useState(false);

  return (
    <Segment className="piece">
      {index % 2 === 0 && (
      <h2>
        {index / 2 + 1}
        .
      </h2>
      )}
      <Button onClick={doDelete}>&times;</Button>
      <Button onClick={doMoveUp}>Up</Button>
      <Button onClick={doMoveDown}>Down</Button>
      <p>
        <em>Time:</em>
        {' '}
        {value.startMinute > -1 ? intToTimeString(value.startMinute, startTime) : intToTimeString(0, startTime)}
      </p>

      {editing ? (
        <>
          <Button onClick={() => {
            setEditing(false);
          }}
          >
            Back
          </Button>
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
          <Button onClick={() => {
            setEditing(true);
          }}
          >
            Edit
          </Button>
          <p>{value.text.length > 0 ? value.text : (<em>Empty</em>)}</p>
        </>
      )}
    </Segment>
  );
};

export default Piece;

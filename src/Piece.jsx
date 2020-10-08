import React from 'react';
import { intToTimeString, timeStringToInt, getCurrentTimeString, compareTimeStrings } from './utils';
import { Button, Segment, Input, Grid } from 'semantic-ui-react';

const Piece = ({
  doDelete, doMoveUp, doMoveDown, onChange, value, startTime, index,
}) => {
  const [editing, setEditing] = React.useState(false);


  const cts = getCurrentTimeString();
  const ts = intToTimeString(value.startMinute, startTime);

  const clr = compareTimeStrings(cts, ts) > 0 ? 'black' :
    compareTimeStrings(cts, ts) === 0 ? 'green' : 'blue';

  return (
    <Segment className="piece" color={clr} inverted>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
      {index % 2 === 0 && (
        <h2>
          {index / 2 + 1}
          .
        </h2>
      )}
            </Grid.Column>
            <Grid.Column>

      <Button onClick={doDelete}>&times;</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>

      {/* <Button onClick={doMoveUp}>Up</Button>
      <Button onClick={doMoveDown}>Down</Button> */}
      <p>
        <em>Time:</em>
        {' '}
        {/* {value.startMinute + ' , ' + startTime} */}
        {/* <br/> */}
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
          <Input
            type="text"
            placeholder="Type here..."
            value={value.text}
            onChange={(ev) => {
              onChange({ text: ev.target.value });
            }}
          />
        </>
      ) : (
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>

          <p>{value.text.length > 0 ? value.text : (<small className='dimmed'><em>Empty</em></small>)}</p>
            </Grid.Column>
            <Grid.Column>
          <Button onClick={() => {
            setEditing(true);
          }}
          >
            Edit
          </Button>
            </Grid.Column>
          </Grid.Row>
          </Grid>

      )}
    </Segment>
  );
};

export default Piece;

import React from 'react';
import { Button, Grid } from 'semantic-ui-react';
import Piece from './Piece';

export const Bar = ({ pieces, onPiecesChange, startTime }) => (
  <div>
    <Button onClick={() => {
      onPiecesChange([...pieces, { text: '', startMinute: -1 }]);
    }}
    >
      Add new piece
    </Button>

    <Grid columns={4} className="bar">
      {pieces.map((p, i) => {
        // console.log(i, p);;
        return (
          <Grid.Column>

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
              startTime={startTime} />
          </Grid.Column>
        );
      })}
    </Grid>
  </div>
);

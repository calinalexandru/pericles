import { Grid, } from '@mui/material';
import React, { useMemo, } from 'react';

import NextButton from './NextButton';
import PlayButton from './PlayButton';
import PrevButton from './PrevButton';
import StopButton from './StopButton';
import { buttonGridSX, containerSX, } from './style';

export default function PlayerComponent() {
  const playGridSx = useMemo(
    () => ({
      ...buttonGridSX,
      borderBottom: 'none',
      bgcolor: 'secondary.light',
    }),
    []
  );

  const stopGridSx = useMemo(
    () => ({
      ...buttonGridSX,
      borderBottom: 'none',
      borderLeft: 'none',
    }),
    []
  );

  const nextGridSx = useMemo(
    () => ({
      ...buttonGridSX,
      borderLeft: 'none',
    }),
    []
  );

  return (
    <>
      <Grid
        container={true}
        alignItems="center"
        sx={containerSX}>
        <Grid
          xs={9}
          sx={playGridSx}
          item={true}>
          <PlayButton />
        </Grid>
        <Grid
          xs={3}
          item={true}
          sx={stopGridSx}>
          <StopButton />
        </Grid>
      </Grid>
      <Grid
        container={true}
        alignItems="center">
        <Grid
          item={true}
          xs={6}
          sx={buttonGridSX}>
          <PrevButton />
        </Grid>
        <Grid
          item={true}
          xs={6}
          sx={nextGridSx}>
          <NextButton />
        </Grid>
      </Grid>
    </>
  );
}

import { Grid, } from '@mui/material';
import React from 'react';

import NextButton from './NextButton';
import PlayButton from './PlayButton';
import PrevButton from './PrevButton';
import StopButton from './StopButton';
import { buttonGridSX, containerSX, } from './style';

export default function PlayerComponent() {
  return (
    <>
      <Grid
        container={true}
        align="center"
        sx={containerSX}>
        <Grid
          xs={9}
          sx={{
            ...buttonGridSX,
            borderBottom: 'none',
            bgcolor: 'secondary.light',
          }}
          item={true}
        >
          <PlayButton />
        </Grid>
        <Grid
          xs={3}
          item={true}
          sx={{
            ...buttonGridSX,
            borderBottom: 'none',
            borderLeft: 'none',
          }}
        >
          <StopButton />
        </Grid>
      </Grid>
      <Grid
        container={true}
        align="center">
        <Grid
          item={true}
          xs={6}
          sx={buttonGridSX}>
          <PrevButton />
        </Grid>
        <Grid
          item={true}
          xs={6}
          sx={{
            ...buttonGridSX,
            borderLeft: 'none',
          }}
        >
          <NextButton />
        </Grid>
      </Grid>
    </>
  );
}

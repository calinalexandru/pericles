import { keyframes, } from '@emotion/react';
import { t, } from '@lingui/macro';
import { SickSharp, } from '@mui/icons-material';
import {
  Typography,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
} from '@mui/material';
import { green, purple, } from '@mui/material/colors';
import { bool, func, number, } from 'prop-types';
import { applySpec, } from 'ramda';
import React from 'react';
import { connect, } from 'react-redux';

import { VARIABLES, } from '@pericles/constants';
import {
  appSkipDeadSectionsSelector,
  playerNext,
  playerStop,
  routeIndex,
  setApp,
} from '@pericles/store';

const colorLoop = keyframes`
0%, 100% {
  transform: scale(1.05);
  fill: ${green[500]};
}
50% {
  transform: scale(1);
  fill: ${purple[500]};
}
`;

function SkipPage({
  onContinue,
  onBack,
  onToggleSkipDeadSections,
  skipDeadSections,
}) {
  const handleAutoSkip = () => {
    onToggleSkipDeadSections(!skipDeadSections);
  };

  return (
    <Box
      m={2}
      p={2}>
      <Typography>{t`skip_page_title`}</Typography>
      <Box
        m={2}
        p={2}
        sx={{
          display: 'flex',
          flexFlow: 'column nowrap',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100px',
        }}
      >
        <SickSharp
          sx={{
            fontSize: 80,
            color: green[500],
            animation: `${colorLoop} 2s infinite ease`,
          }}
        />
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            onChange={handleAutoSkip}
            checked={skipDeadSections} />
        }
        label={t`skip_page_subtitle`}
      />

      <Stack
        direction="row"
        mt={2}
        justifyContent="space-evenly">
        <Button
          variant="contained"
          onClick={onBack}>
          {t`stop_btn`}
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={onContinue}>
          {t`resume_btn`}
        </Button>
      </Stack>
    </Box>
  );
}

SkipPage.propTypes = {
  onContinue: func,
  onBack: func,
  skipDeadSections: bool,
  onToggleSkipDeadSections: func,
};

SkipPage.defaultProps = {
  onContinue: () => {},
  onBack: () => {},
  skipDeadSections: number,
  onToggleSkipDeadSections: () => {},
};

const continuePlaying = () => (dispatch) => {
  dispatch(routeIndex());
  dispatch(playerNext());
};

const stopPlaying = () => (dispatch) => {
  dispatch(routeIndex());
  dispatch(playerStop());
};

const mapStateToProps = applySpec({
  skipDeadSections: appSkipDeadSectionsSelector,
});

const mapDispatchToProps = (dispatch) => ({
  onContinue: () => {
    continuePlaying()(dispatch);
  },
  onBack: () => {
    stopPlaying()(dispatch);
  },
  onToggleSkipDeadSections: (val) => {
    dispatch(setApp({ [VARIABLES.APP.SKIP_DEAD_SECTIONS]: val, }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SkipPage);

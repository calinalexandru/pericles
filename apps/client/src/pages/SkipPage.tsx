import { keyframes, } from '@emotion/react';
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
import React, { useCallback, useMemo, } from 'react';
import { useDispatch, useSelector, } from 'react-redux';

import { VARIABLES, } from '@pericles/constants';
import {
  appActions,
  appSkipDeadSectionsSelector,
  playerActions,
} from '@pericles/store';
import { t, } from '@pericles/util';

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

const boxStyles = {
  m: 2,
  p: 2,
};

const iconBoxStyles = {
  m: 2,
  p: 2,
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100px',
};

const iconStyles = {
  fontSize: 80,
  color: green[500],
  animation: `${colorLoop} 2s infinite ease`,
};

const SkipPage: React.FC = () => {
  const dispatch = useDispatch();
  const skipDeadSections = useSelector(appSkipDeadSectionsSelector);

  const handleAutoSkip = useCallback(() => {
    dispatch(
      appActions.set({ [VARIABLES.APP.SKIP_DEAD_SECTIONS]: !skipDeadSections, })
    );
  }, [ dispatch, skipDeadSections, ]);

  const checkbox = useMemo(
    () => <Checkbox
      onChange={handleAutoSkip}
      checked={skipDeadSections} />,
    [ handleAutoSkip, skipDeadSections, ]
  );

  return (
    <Box sx={boxStyles}>
      <Typography>{t`skip_page_title`}</Typography>
      <Box sx={iconBoxStyles}>
        <SickSharp sx={iconStyles} />
      </Box>
      <FormControlLabel
        control={checkbox}
        label={t`skip_page_subtitle`} />

      <Stack
        direction="row"
        mt={2}
        justifyContent="space-evenly">
        <Button
          variant="contained"
          onClick={() => {
            dispatch(appActions.routeIndex());
            dispatch(playerActions.stop());
          }}
        >
          {t`stop_btn`}
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            dispatch(appActions.routeIndex());
            dispatch(playerActions.next({ auto: false, }));
          }}
        >
          {t`resume_btn`}
        </Button>
      </Stack>
    </Box>
  );
};

export default SkipPage;

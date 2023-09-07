import { keyframes, } from '@emotion/react';
import { LocalFireDepartmentSharp, } from '@mui/icons-material';
import { Typography, Box, Button, } from '@mui/material';
import { lightBlue, orange, red, } from '@mui/material/colors';
import React from 'react';
import { useSelector, } from 'react-redux';

import usePlayer from '@/hooks/usePlayer';
import useRoutes from '@/hooks/useRoutes';
import { PLAYER_STATUS, } from '@pericles/constants';
import { playerStatusSelector, } from '@pericles/store';
import { t, } from '@pericles/util';

const colorLoop = keyframes`
0%, 100% {
  transform: scale(1.05);
  fill: ${red[500]};
}
50% {
  transform: scale(0.95);
  fill: ${orange[500]};
}
`;

export default function CooldownPage() {
  const { index: goToIndex, } = useRoutes();
  const { play, } = usePlayer();
  const status = useSelector(playerStatusSelector);
  const onContinue = () => {
    goToIndex();
    play();
  };
  const fireDep =
    status !== PLAYER_STATUS.OVERLOAD
      ? { color: lightBlue[200], }
      : {
        color: red[500],
        animation: `${colorLoop} 2s infinite ease`,
      };

  return (
    <Box
      m={2}
      p={2}>
      <Typography>{t`servers_overload`}</Typography>
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
        <LocalFireDepartmentSharp
          sx={{
            fontSize: 80,
            ...fireDep,
          }}
        />
      </Box>
      <Box mt={2}>
        <Button
          sx={{
            visibility:
              status !== PLAYER_STATUS.OVERLOAD ? 'visibile' : 'hidden',
          }}
          variant="contained"
          onClick={goToIndex}
        >
          {t`back_btn`}
        </Button>
        <Button
          color="secondary"
          sx={{
            visibility:
              status !== PLAYER_STATUS.OVERLOAD ? 'visibile' : 'hidden',
          }}
          variant="contained"
          onClick={onContinue}
        >
          {t`continue_btn`}
        </Button>
      </Box>
    </Box>
  );
}

// CooldownPage.defaultProps = {
// status: PLAYER_STATUS.OVERLOAD,
// };

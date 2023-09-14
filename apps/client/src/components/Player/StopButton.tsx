import { StopSharp, } from '@mui/icons-material';
import { IconButton, } from '@mui/material';
import React from 'react';
import { useSelector, } from 'react-redux';

import usePlayer from '@/hooks/usePlayer';
import { PLAYER_STATUS, PlayerStatusTypes, } from '@pericles/constants';
import { playerStatusSelector, } from '@pericles/store';

const stopButtonSx = {
  width: '100%',
  p: 2,
  borderRadius: 0,
};
const iconSx = { fontSize: '1.9rem', };

export default function StopButton() {
  const { stop, } = usePlayer();
  const status = useSelector(playerStatusSelector);
  return (
    <IconButton
      disabled={(
        [
          PLAYER_STATUS.STOPPED,
          PLAYER_STATUS.LOADING,
          PLAYER_STATUS.WAITING,
        ] as PlayerStatusTypes[]
      ).includes(status)}
      onClick={stop}
      color="primary"
      size="large"
      sx={stopButtonSx}
    >
      <StopSharp sx={iconSx} />
    </IconButton>
  );
}

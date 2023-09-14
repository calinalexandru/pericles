import { SkipNextSharp, } from '@mui/icons-material';
import { IconButton, } from '@mui/material';
import React from 'react';
import { useSelector, } from 'react-redux';

import usePlayer from '@/hooks/usePlayer';
import { PLAYER_STATUS, PlayerStatusTypes, } from '@pericles/constants';
import { playerStatusSelector, } from '@pericles/store';

const nextButtonSx = { width: '100%', borderRadius: 0, };
const iconSx = { fontSize: '1.9rem', };

export default function NextButton() {
  const { next, } = usePlayer();
  const status = useSelector(playerStatusSelector);
  return (
    <IconButton
      disabled={(
        [
          PLAYER_STATUS.STOPPED,
          PLAYER_STATUS.LOADING,
          PLAYER_STATUS.ERROR,
        ] as PlayerStatusTypes[]
      ).includes(status)}
      onClick={next}
      color="primary"
      size="small"
      sx={nextButtonSx}
    >
      <SkipNextSharp sx={iconSx} />
    </IconButton>
  );
}

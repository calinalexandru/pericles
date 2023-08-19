import { SkipPreviousSharp, } from '@mui/icons-material';
import { IconButton, } from '@mui/material';
import React from 'react';
import { useSelector, } from 'react-redux';

import usePlayer from '@/hooks/usePlayer';
import { PLAYER_STATUS, } from '@pericles/constants';
import { playerStatusSelector, } from '@pericles/store';

export default function PrevButton() {
  const { prev, } = usePlayer();
  const status = useSelector(playerStatusSelector);
  return (
    <IconButton
      disabled={[
        PLAYER_STATUS.STOPPED,
        PLAYER_STATUS.LOADING,
        PLAYER_STATUS.ERROR,
      ].includes(status)}
      onClick={prev}
      color="primary"
      size="small"
      sx={{ width: '100%', borderRadius: 0, }}
    >
      <SkipPreviousSharp sx={{ fontSize: '1.9rem', }} />
    </IconButton>
  );
}

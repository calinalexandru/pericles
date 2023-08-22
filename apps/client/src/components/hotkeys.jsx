import {
  TextField, Typography, Alert, Box, Stack, 
} from '@mui/material';
import React, { useState, } from 'react';
import { useSelector, } from 'react-redux';

import useHotkeysSettings from '@/hooks/useHotkeysSettings';
import usePlayer from '@/hooks/usePlayer';
import {
  hotkeysNextSelector,
  hotkeysPlaySelector,
  hotkeysPrevSelector,
  hotkeysStartSelector,
  hotkeysStopSelector,
  playerStatusSelector,
} from '@pericles/store';
import { isStopped, } from '@pericles/util';

let keysMap = Object.create(null);
const textFieldInputProps = {
  readOnly: true,
};

export default function HotkeysComponent() {
  const [ ignoreWarning, setIgnoreWarning, ] = useState(false);
  const { stop: playerStop, } = usePlayer();
  const status = useSelector(playerStatusSelector);
  const start = useSelector(hotkeysStartSelector);
  const play = useSelector(hotkeysPlaySelector);
  const stop = useSelector(hotkeysStopSelector);
  const next = useSelector(hotkeysNextSelector);
  const prev = useSelector(hotkeysPrevSelector);
  const { setHotkeysSetting, } = useHotkeysSettings();
  const stopIfPlaying = () => {
    if (isStopped(status)) playerStop();
  };

  const getKeyCombo = (keys) =>
    keys
      .map((playKey) => {
        // console.log('getKeyCombo', playKey);
        if (playKey?.key?.trim?.()?.length) {
          return playKey.key.toLocaleUpperCase();
        }
        return playKey.code.toLocaleUpperCase();
      })
      .sort((a, b) => b.length - a.length)
      .join('+');

  const playDefault = getKeyCombo(play);
  const stopDefault = getKeyCombo(stop);
  const nextDefault = getKeyCombo(next);
  const prevDefault = getKeyCombo(prev);
  const startDefault = getKeyCombo(start);

  return (
    <div>
      <Box p={2}>
        <form
          noValidate={true}
          autoComplete="off">
          <Typography
            variant="subtitle1"
            component="p"
            gutterBottom={true}>
            Customize hotkeys to your needs.
          </Typography>
          <Stack
            direction="column"
            spacing={1}>
            <TextField
              inputProps={textFieldInputProps}
              id="filled-basic"
              label="start"
              variant="filled"
              onKeyUp={(e) => {
                keysMap[e.code] = { key: e.key, code: e.code, };
                setHotkeysSetting('start', Object.values(keysMap));
              }}
              onKeyDown={() => {
                keysMap = Object.create(null);
              }}
              onFocus={stopIfPlaying}
              value={startDefault}
            />
            {start.length <= 1 && !ignoreWarning ? (
              <Alert
                severity="warning"
                onClose={() => {
                  setIgnoreWarning(true);
                }}
              >
                Using two hotkeys combo is recommended for starting the app.
              </Alert>
            ) : null}
            <TextField
              inputProps={textFieldInputProps}
              id="filled-basic"
              label="play/pause"
              variant="filled"
              onKeyUp={(e) => {
                keysMap[e.code] = { key: e.key, code: e.code, };
                setHotkeysSetting('play', Object.values(keysMap));
              }}
              onKeyDown={() => {
                keysMap = Object.create(null);
              }}
              onFocus={stopIfPlaying}
              value={playDefault}
            />
            <TextField
              id="filled-basic"
              inputProps={textFieldInputProps}
              label="stop"
              variant="filled"
              onKeyUp={(e) => {
                keysMap[e.code] = { key: e.key, code: e.code, };
                setHotkeysSetting('stop', Object.values(keysMap));
              }}
              onKeyDown={() => {
                keysMap = Object.create(null);
              }}
              onFocus={stopIfPlaying}
              value={stopDefault}
            />
            <TextField
              id="filled-basic"
              inputProps={textFieldInputProps}
              onKeyUp={(e) => {
                keysMap[e.code] = { key: e.key, code: e.code, };
                setHotkeysSetting('next', Object.values(keysMap));
              }}
              onKeyDown={() => {
                keysMap = Object.create(null);
              }}
              onFocus={stopIfPlaying}
              label="next"
              variant="filled"
              value={nextDefault}
            />
            <TextField
              inputProps={textFieldInputProps}
              id="filled-basic"
              label="prev"
              onKeyUp={(e) => {
                keysMap[e.code] = { key: e.key, code: e.code, };
                setHotkeysSetting('prev', Object.values(keysMap));
              }}
              onKeyDown={() => {
                keysMap = Object.create(null);
              }}
              onFocus={stopIfPlaying}
              variant="filled"
              value={prevDefault}
            />
          </Stack>
        </form>
      </Box>
    </div>
  );
}

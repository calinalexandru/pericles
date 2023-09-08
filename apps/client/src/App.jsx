import {
  Alert, Box, CssBaseline, Snackbar, 
} from '@mui/material';
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from '@mui/material/styles';
import { keys, } from 'ramda';
import React, { Suspense, useEffect, useMemo, } from 'react';
import { useDispatch, useSelector, } from 'react-redux';

import LoadingSpinner from '@/primitives/LoadingSpinner';
import {
  notificationTextSelector,
  notificationTypeSelector,
  appThemeModeSelector,
  appRouteSelector,
  hotkeysSelector,
  hotkeysDisableSelector,
  notificationClear,
  playerToggle as actionPlayerToggle,
  playerSoftNext,
  playerSoftPrev,
  playerStop as actionPlayerStop,
  playerHealthCheck,
  playerStatusSelector,
} from '@pericles/store';
import { isStopped, } from '@pericles/util';

import routes from './routes';
import { paletteDark, paletteLight, } from './theme';

import './App.css';

const appBoxStyle = {
  width: '360px',
  minHeight: '100px',
  maxHeight: '600px',
  overflow: 'hidden',
  bgcolor: 'background.default',
  color: 'text.primary',
  transition: 'all .5s linear',
};

const snackBarProps = {
  vertical: 'top',
  horizontal: 'center',
};

const alertStyle = {
  width: '100%',
};

function App() {
  // console.log('App', { appRoute });
  let keysMap = Object.create(null);
  const dispatch = useDispatch();
  const appRoute = useSelector(appRouteSelector);
  const notificationText = useSelector(notificationTextSelector);
  const notificationType = useSelector(notificationTypeSelector);
  const themeMode = useSelector(appThemeModeSelector);
  const hotkeys = useSelector(hotkeysSelector);
  const disableHotkeys = useSelector(hotkeysDisableSelector);

  const spinner = useMemo(() => <LoadingSpinner />, []);

  const onClearNotification = () => {
    dispatch(notificationClear());
  };

  const playerToggle = () => dispatch(actionPlayerToggle());
  const playerNext = () => dispatch(playerSoftNext());
  const playerPrev = () => dispatch(playerSoftPrev());
  const playerStop = () => dispatch(actionPlayerStop());
  const hotkeyEvents = {
    play: () => {
      // console.log('hotkeyEvents.toggle');
      playerToggle();
    },
    stop: () => {
      // console.log('hotkeyEvents.stop');
      playerStop();
    },
    next: () => {
      // console.log('hotkeyEvents.next');
      playerNext();
    },
    prev: () => {
      // console.log('hotkeyEvents.prev');
      playerPrev();
    },
  };

  const playerStatus = useSelector(playerStatusSelector);

  // TODO:: not sure about this
  // we want to trigger this hook once
  // with the initial playerStatus found in state
  // on application mount to decide
  // if we want to dispatch a heath check
  useEffect(() => {
    if (!isStopped(playerStatus)) {
      dispatch(playerHealthCheck());
    }

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [ dispatch, ]);

  const onKeyUp = (e) => {
    if (disableHotkeys) return;
    // console.log('onKeyPress$', e);
    keysMap[e.code] = { key: e.key, code: e.code, };
    const activeHotkeys = keys(keysMap)
      .filter((k) => keysMap[k] !== false)
      .map((k) => keysMap[k].code)
      .sort();
    // console.log('activeHotkeys', activeHotkeys);
    const curEvent = Object.keys(hotkeyEvents).find((evt) => {
      const candidates = hotkeys[evt].map((key) => key.code).sort();
      // console.log('candidates', candidates);
      return JSON.stringify(activeHotkeys) === JSON.stringify(candidates);
    });
    if (curEvent && hotkeyEvents[curEvent]) hotkeyEvents[curEvent]();
  };

  const onKeyDown = () => {
    keysMap = Object.create(null);
  };

  // HOTKEYS HOOK
  useEffect(() => {
    document.addEventListener('keydown', onKeyUp);
    document.addEventListener('keyup', onKeyDown);

    return () => {
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [ disableHotkeys, ]);

  const CurrentPage = useMemo(() => routes[appRoute], [ appRoute, ]);
  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: '"Sora", Roboto',
          fontSize: 13,
        },
        palette:
          themeMode === 'light' ? { ...paletteLight, } : { ...paletteDark, },
      }),
    [ themeMode, ]
  );

  return (
    <StyledEngineProvider injectFirst={true}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={appBoxStyle}>
          <Snackbar
            anchorOrigin={snackBarProps}
            open={!!notificationText}
            onClose={onClearNotification}
          >
            <Alert
              severity={notificationType}
              sx={alertStyle}
              onClose={onClearNotification}
            >
              {notificationText}
            </Alert>
          </Snackbar>
          <Suspense fallback={spinner}>
            <CurrentPage />
          </Suspense>
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;

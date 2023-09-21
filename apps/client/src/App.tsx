import {
  Alert,
  AlertColor,
  Box,
  CssBaseline,
  PaletteMode,
  Snackbar,
  SnackbarOrigin,
} from '@mui/material';
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from '@mui/material/styles';
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
  notificationActions,
  playerActions,
} from '@pericles/store';

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
} as SnackbarOrigin;

const alertStyle = {
  width: '100%',
};

const App: React.FC = () => {
  // console.log('App', { appRoute });
  let keysMap: Record<string, { key: string; code: string }> =
    Object.create(null);
  const dispatch = useDispatch();
  const appRoute = useSelector(appRouteSelector);
  const notificationText = useSelector(notificationTextSelector);
  const notificationType = useSelector(notificationTypeSelector) as AlertColor;
  const themeMode = useSelector(appThemeModeSelector) as PaletteMode;
  const hotkeys = useSelector(hotkeysSelector) as any;
  const disableHotkeys = useSelector(hotkeysDisableSelector);

  const spinner = useMemo(() => <LoadingSpinner />, []);

  const onClearNotification = () => {
    dispatch(notificationActions.clear());
  };

  const playerToggle = () => dispatch(playerActions.toggle());
  const playerNext = () => dispatch(playerActions.softNext());
  const playerPrev = () => dispatch(playerActions.softPrev());
  const playerStop = () => dispatch(playerActions.stop());
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
  } as any;

  const onKeyUp = (e: KeyboardEvent) => {
    if (disableHotkeys) return;
    // console.log('onKeyPress$', e);
    keysMap[e.code] = { key: e.key, code: e.code, };
    const activeHotkeys = Object.keys(keysMap)
      .filter((k) => !keysMap[k])
      .map((k) => keysMap[k].code)
      .sort();
    // console.log('activeHotkeys', activeHotkeys);
    const curEvent = Object.keys(hotkeyEvents).find((evt: string) => {
      const candidates = hotkeys[evt].map((key: any) => key.code).sort();
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

  const CurrentPage = useMemo(() => (routes as any)[appRoute], [ appRoute, ]);
  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: '"Sora", Roboto',
          fontSize: 13,
        },
        palette: (themeMode === 'light'
          ? { ...paletteLight, }
          : { ...paletteDark, }) as any,
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
};

export default App;

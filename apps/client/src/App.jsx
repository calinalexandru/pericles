import { useLingui, } from '@lingui/react';
import {
  Alert, Box, CssBaseline, Snackbar, 
} from '@mui/material';
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from '@mui/material/styles';
import { string, func, bool, } from 'prop-types';
import { applySpec, keys, } from 'ramda';
import React, {
  Suspense, useEffect, memo, useMemo, 
} from 'react';
import { connect, } from 'react-redux';

import LoadingSpinner from '@/primitives/loadingSpinner';
import { DEFAULT_VALUES, } from '@pericles/constants';
import {
  notificationActions,
  notificationTextSelector,
  notificationTypeSelector,
  appThemeModeSelector,
  appLanguageSelector,
  appRouteSelector,
  playerActions,
  hotkeysSelector,
  hotkeysDisableSelector,
} from '@pericles/store';

import routes from './routes';
import { paletteDark, paletteLight, } from './theme';
import './App.css';

const { notification, } = notificationActions;
const { player, } = playerActions;

function App({
  appRoute,
  notificationType,
  notificationText,
  onClearNotification,
  themeMode,
  language,
  hotkeys,
  disableHotkeys,
  playerToggle,
  playerStop,
  playerNext,
  playerPrev,
}) {
  // console.log('App', { appRoute });
  const { i18n, } = useLingui();
  let keysMap = Object.create(null);

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

  useEffect(() => {
    // console.log('activating', language);
    i18n.activate(language);
  }, [ language, ]);

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
        <Box
          sx={{
            width: '360px',
            minHeight: '100px',
            maxHeight: '600px',
            overflow: 'hidden',
            bgcolor: 'background.default',
            color: 'text.primary',
            transition: 'all .5s linear',
          }}
        >
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
            open={!!notificationText}
            onClose={onClearNotification}
          >
            <Alert
              severity={notificationType}
              sx={{ width: '100%', }}
              onClose={onClearNotification}
            >
              {notificationText}
            </Alert>
          </Snackbar>
          <Suspense fallback={<LoadingSpinner />}>
            <CurrentPage />
          </Suspense>
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

App.propTypes = {
  language: string,
  appRoute: string,
  notificationText: string,
  notificationType: string,
  onClearNotification: func,
  themeMode: string,
  hotkeys: {},
  disableHotkeys: bool,
  playerToggle: func,
  playerNext: func,
  playerPrev: func,
  playerStop: func,
};

App.defaultProps = {
  language: DEFAULT_VALUES.APP.LANGUAGE,
  appRoute: DEFAULT_VALUES.APP.ROUTE,
  themeMode: DEFAULT_VALUES.APP.THEME_MODE,
  notificationText: DEFAULT_VALUES.NOTIFICATION.TEXT,
  notificationType: DEFAULT_VALUES.NOTIFICATION.TYPE,
  onClearNotification: () => {},
  hotkeys: {},
  disableHotkeys: DEFAULT_VALUES.HOTKEYS.DISABLE,
  playerToggle: () => {},
  playerNext: () => {},
  playerPrev: () => {},
  playerStop: () => {},
};

const mapStateToProps = applySpec({
  appRoute: appRouteSelector,
  notificationText: notificationTextSelector,
  notificationType: notificationTypeSelector,
  themeMode: appThemeModeSelector,
  language: appLanguageSelector,
  hotkeys: hotkeysSelector,
  disableHotkeys: hotkeysDisableSelector,
});

const mapDispatchToProps = (dispatch) => ({
  onClearNotification: () => dispatch(notification.clear()),
  playerToggle: () => dispatch(player.toggle()),
  playerNext: () => dispatch(player.softNext()),
  playerPrev: () => dispatch(player.softPrev()),
  playerStop: () => dispatch(player.stop()),
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(App));

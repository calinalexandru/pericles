import { t, } from '@lingui/macro';
import { Brightness2Sharp, Brightness7Sharp, } from '@mui/icons-material';
import {
  Button,
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  ButtonGroup,
  Stack,
} from '@mui/material';
import { func, string, } from 'prop-types';
import { applySpec, keys, propOr, } from 'ramda';
import React, { useState, } from 'react';
import { connect, } from 'react-redux';

import Flag from '@/primitives/flag';
import Subtitle from '@/primitives/subtitle';
import {
  VARIABLES,
  MESSAGES,
  DEFAULT_VALUES,
  ISO_LANGS,
} from '@pericles/constants';
import {
  appFactoryReset,
  appLanguageSelector,
  appReload,
  appThemeModeSelector,
  setApp,
} from '@pericles/store';
import { getIsoLangFromString, } from '@pericles/util';

function MiscPage({
  onOtherSettingsChanged,
  onReloadApp,
  onFactoryReset,
  language,
  setThemeMode,
  themeMode,
}) {
  const [ reloadApp, setReloadApp, ] = useState(false);
  const [ factoryReset, setFactoryReset, ] = useState(false);

  const onReloadAbort = () => {
    setReloadApp(false);
  };

  const onFactoryResetAbort = () => {
    setFactoryReset(false);
  };

  const isDarkMode = themeMode === 'dark';
  const isLightMode = themeMode === 'light';

  return (
    <>
      <Box
        ml={2}
        mr={2}>
        <Subtitle>{t`mode`}</Subtitle>
        <ButtonGroup
          variant="outlined"
          aria-label="outlined button group"
          fullWidth={true}
        >
          <Button
            onClick={() => {
              setThemeMode('light');
            }}
            style={{
              textTransform: 'initial',
            }}
            sx={
              isLightMode
                ? {
                  bgcolor: 'secondary.main',
                }
                : {}
            }
          >
            <Brightness7Sharp
              fontSize="small"
              style={{
                marginRight: '3px',
              }}
            />
            {t`light`}
          </Button>
          <Button
            onClick={() => {
              setThemeMode('dark');
            }}
            style={{
              textTransform: 'initial',
            }}
            sx={
              isDarkMode
                ? {
                  bgcolor: 'primary.light',
                }
                : {}
            }
          >
            <Brightness2Sharp
              fontSize="small"
              style={{
                marginRight: '3px',
              }}
            />
            {t`dark`}
          </Button>
        </ButtonGroup>
      </Box>

      <Box
        ml={2}
        mr={2}>
        <Subtitle>{t`change_language_label`}</Subtitle>
        <FormControl
          size="small"
          fullWidth={true}>
          <Select
            value={language}
            onChange={(e) => {
              onOtherSettingsChanged(VARIABLES.APP.LANGUAGE, e.target.value);
            }}
          >
            {keys(MESSAGES).map((locale) => (
              <MenuItem
                key={locale}
                value={locale}>
                <Flag
                  lang={propOr({}, getIsoLangFromString(locale), ISO_LANGS)}
                  title={MESSAGES[locale].nativeName}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box m={2}>
        <Subtitle>{t`system`}</Subtitle>
        <Typography
          variant="subtitle2"
          component="p">
          &nbsp;
        </Typography>
        <Stack
          direction="row"
          spacing={2}>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              setReloadApp(true);
            }}
          >
            {t`reload_app_btn`}
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setFactoryReset(true);
            }}
          >
            {t`factory_reset_btn`}
          </Button>
        </Stack>
      </Box>

      {/* dialog global */}
      <Dialog
        open={factoryReset}
        onClose={onFactoryResetAbort}>
        <DialogTitle>{t`dialog_warning_title`}</DialogTitle>
        <DialogContent>{t`factory_reset_warning`}</DialogContent>
        <DialogActions>
          <Button
            autoFocus={true}
            onClick={onFactoryResetAbort}>
            {t`cancel_btn`}
          </Button>
          <Button
            onClick={() => {
              setFactoryReset(false);
              onFactoryReset();
            }}
          >
            {t`submit_btn`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog global */}
      <Dialog
        open={reloadApp}
        onClose={onReloadAbort}>
        <DialogTitle>{t`dialog_info_title`}</DialogTitle>
        <DialogContent>{t`reload_app_warning`}</DialogContent>
        <DialogActions>
          <Button
            autoFocus={true}
            onClick={onReloadAbort}>
            {t`cancel_btn`}
          </Button>
          <Button onClick={onReloadApp}>{t`submit_btn`}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

MiscPage.propTypes = {
  onOtherSettingsChanged: func,
  onReloadApp: func,
  onFactoryReset: func,
  language: string,
  setThemeMode: func,
  themeMode: string,
};

MiscPage.defaultProps = {
  language: DEFAULT_VALUES.APP.LANGUAGE,
  onReloadApp: () => {},
  onFactoryReset: () => {},
  onOtherSettingsChanged: () => {},
  setThemeMode: () => {},
  themeMode: DEFAULT_VALUES.APP.THEME_MODE,
};

const mapStateToProps = applySpec({
  language: appLanguageSelector,
  themeMode: appThemeModeSelector,
});

const mapDispatchToProps = (dispatch) => ({
  onOtherSettingsChanged: (key, val) => dispatch(setApp({ [key]: val, })),
  onReloadApp: () => dispatch(appReload()),
  onFactoryReset: () => dispatch(appFactoryReset()),
  setThemeMode: (themeMode) => dispatch(setApp({ themeMode, })),
});

export default connect(mapStateToProps, mapDispatchToProps)(MiscPage);

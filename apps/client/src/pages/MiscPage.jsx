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
import { bool, func, string, } from 'prop-types';
import { applySpec, keys, propOr, } from 'ramda';
import React, { useState, } from 'react';
import { connect, } from 'react-redux';

import Flag from '@/primitives/flag';
import Subtitle from '@/primitives/subtitle';
import {
  VARIABLES,
  MESSAGES,
  REGIONS,
  DEFAULT_VALUES,
  ISO_LANGS,
} from '@pericles/constants';
import {
  appActions,
  appLanguageSelector,
  appServiceRegionSelector,
  appScholarModeSelector,
  appThemeModeSelector,
} from '@pericles/store';
import { getIsoLangFromString, } from '@pericles/util';

const { app, } = appActions;

function MiscPage({
  onOtherSettingsChanged,
  onReloadApp,
  onFactoryReset,
  serviceRegion,
  language,
  scholarMode,
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

      {!scholarMode && (
        <Box
          ml={2}
          mr={2}>
          <Subtitle>Service Region</Subtitle>
          <FormControl
            size="small"
            fullWidth={true}>
            <Select
              labelId="service-region-select-label"
              id="service-region-select"
              value={serviceRegion}
              label="Service Region"
              onChange={(e) => {
                onOtherSettingsChanged(
                  VARIABLES.APP.SERVICE_REGION,
                  e.target.value
                );
                onOtherSettingsChanged(
                  VARIABLES.APP.SERVICE_KEY,
                  REGIONS[e.target.value].key
                );
              }}
            >
              {keys(REGIONS).map((region) => (
                <MenuItem
                  key={region}
                  value={region}>
                  {REGIONS[region].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

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
  serviceRegion: string,
  onOtherSettingsChanged: func,
  onReloadApp: func,
  onFactoryReset: func,
  language: string,
  scholarMode: bool,
  setThemeMode: func,
  themeMode: string,
};

MiscPage.defaultProps = {
  serviceRegion: DEFAULT_VALUES.APP.SERVICE_REGION,
  language: DEFAULT_VALUES.APP.LANGUAGE,
  scholarMode: DEFAULT_VALUES.APP.SCHOLAR_MODE,
  onReloadApp: () => {},
  onFactoryReset: () => {},
  onOtherSettingsChanged: () => {},
  setThemeMode: () => {},
  themeMode: DEFAULT_VALUES.APP.THEME_MODE,
};

const mapStateToProps = applySpec({
  serviceRegion: appServiceRegionSelector,
  language: appLanguageSelector,
  scholarMode: appScholarModeSelector,
  themeMode: appThemeModeSelector,
});

const mapDispatchToProps = (dispatch) => ({
  onOtherSettingsChanged: (key, val) => dispatch(app.set({ [key]: val, })),
  onReloadApp: () => dispatch(app.reload()),
  onFactoryReset: () => dispatch(app.factoryReset()),
  setThemeMode: (themeMode) => dispatch(app.set({ themeMode, })),
});

export default connect(mapStateToProps, mapDispatchToProps)(MiscPage);

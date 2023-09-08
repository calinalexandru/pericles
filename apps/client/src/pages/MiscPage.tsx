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
import React, { useState, } from 'react';
import { useSelector, useDispatch, } from 'react-redux';

import { VARIABLES, MESSAGES, ISO_LANGS, } from '@pericles/constants';
import {
  appFactoryReset,
  appLanguageSelector,
  appReload,
  appThemeModeSelector,
  setApp,
} from '@pericles/store';
import { getIsoLangFromString, t, } from '@pericles/util';

import Flag from '../primitives/Flag/Flag';
import Subtitle from '../primitives/subtitle';

const lightButtonSx = {
  bgcolor: 'secondary.main',
};

const darkButtonSx = {
  bgcolor: 'primary.light',
};

const iconStyle = {
  marginRight: '3px',
} as React.CSSProperties;

const buttonStyle = {
  textTransform: 'initial',
} as React.CSSProperties;

const MiscPage: React.FC = () => {
  const dispatch = useDispatch();
  const language = useSelector(appLanguageSelector);
  const themeMode = useSelector(appThemeModeSelector);

  const [ reloadApp, setReloadApp, ] = useState(false);
  const [ factoryReset, setFactoryReset, ] = useState(false);

  const onReloadAbort = () => {
    setReloadApp(false);
  };

  const onFactoryResetAbort = () => {
    setFactoryReset(false);
  };

  const onOtherSettingsChanged = (key: string, val: any) =>
    dispatch(setApp({ [key]: val, }));
  const onReloadApp = () => dispatch(appReload());

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
            onClick={() => dispatch(setApp({ themeMode: 'light', }))}
            style={buttonStyle}
            sx={isLightMode ? lightButtonSx : {}}
          >
            <Brightness7Sharp
              fontSize="small"
              style={iconStyle} />
            {t`light`}
          </Button>
          <Button
            onClick={() => dispatch(setApp({ themeMode: 'dark', }))}
            style={buttonStyle}
            sx={isDarkMode ? darkButtonSx : {}}
          >
            <Brightness2Sharp
              fontSize="small"
              style={iconStyle} />
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
            onChange={(e) =>
              onOtherSettingsChanged(VARIABLES.APP.LANGUAGE, e.target.value)
            }
          >
            {Object.keys(MESSAGES).map((locale) => (
              <MenuItem
                key={locale}
                value={locale}>
                <Flag
                  lang={ISO_LANGS[getIsoLangFromString(locale)] || {}}
                  title={(MESSAGES as any)[locale].nativeName}
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
            onClick={() => setReloadApp(true)}
          >
            {t`reload_app_btn`}
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setFactoryReset(true)}
          >
            {t`factory_reset_btn`}
          </Button>
        </Stack>
      </Box>

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
              dispatch(appFactoryReset());
            }}
          >
            {t`submit_btn`}
          </Button>
        </DialogActions>
      </Dialog>

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
};

export default MiscPage;

import {
  TextField,
  Box,
  Grid,
  Typography,
  Slider,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { propOr, } from 'ramda';
import React, { useMemo, useState, } from 'react';
import { useSelector, } from 'react-redux';

import useSettings from '@/hooks/useSettings';
import AutocompleteOption from '@/primitives/autocompleteOption';
import FlagLabel from '@/primitives/Flag/Flag';
import {
  ISO_LANGS,
  COUNTRIES,
  DEFAULT_VALUES,
  VARIABLES,
  ATTRIBUTES,
} from '@pericles/constants';
import {
  settingsPitchSelector,
  settingsRateSelector,
  settingsVoiceSelector,
  settingsVoicesSelector,
  settingsVolumeSelector,
} from '@pericles/store';
import {
  getIsoLangFromString,
  getIsoLang,
  getCountry,
  t,
} from '@pericles/util';

import filterFunc from './utils';

const useStyles = makeStyles(() => ({
  text: {
    fontSize: 12,
  },
  flagImg: {
    width: 30,
  },
  flagOptionImg: {
    marginRight: 8,
  },
  countryImg: {
    width: 12,
  },
  countryOptImg: {
    marginLeft: -20,
  },
}));
let timerVolume = 0;
let timerPitch = 0;
let timerRate = 0;

export default function SettingsComponent() {
  console.log('SettingsComponent.rendering');
  const { setSetting: onSettingChanged, } = useSettings();
  const volume = useSelector(settingsVolumeSelector);
  const rate = useSelector(settingsRateSelector);
  const pitch = useSelector(settingsPitchSelector);
  const voiceProp = useSelector(settingsVoiceSelector);
  const voices = useSelector(settingsVoicesSelector);
  const classes = useStyles();
  const [ inputVolume, setInputVolume, ] = useState(volume);
  const [ inputRate, setInputRate, ] = useState(rate);
  const [ inputPitch, setInputPitch, ] = useState(pitch);

  const options = useMemo(() => voices, [ voices, ]);

  const voiceChanged = (event, value, key) => {
    console.log('voiceChanged-internal', event, value, key);
    if (!value) return;
    onSettingChanged(VARIABLES.SETTINGS.VOICE, value.id);
  };

  const voice = useMemo(
    () => propOr({}, voiceProp, voices),
    [ voiceProp, voices, ]
  );

  console.log('voices', voices);

  return (
    <Box p={1}>
      <Box
        mt={1}
        mb={1}>
        <Autocomplete
          autoSelect={true}
          onClick={() => {
            console.log('you clicked it');
          }}
          // open
          // disableCloseOnSelect
          filterOptions={filterFunc}
          size="small"
          openOnFocus={true}
          id="change-voice-combo"
          // ListboxComponent={ListboxComponent}
          options={options}
          getOptionLabel={(option) => option.shortTitle}
          groupBy={(option) => option.groupName}
          onChange={voiceChanged}
          isOptionEqualToValue={({ id, }, { id: valueId, }) => id === valueId}
          style={{ width: '100%', }}
          value={voice}
          // renderOption={(props, option) => ({ props, option })}
          renderOption={(
            { onClick, key, 'data-option-index': optionIndex, },
            option
          ) => {
            // console.log('renderOption', props);
            const { lang = '', countryCode = '', shortTitle = '', } = option;
            // console.log({ lang, countryCode, shortTitle });
            const iso = getIsoLang(getIsoLangFromString(lang));
            const dialect = getCountry(countryCode.toLocaleLowerCase());
            // console.log('renderOption', option, iso, dialect);
            return (
              <AutocompleteOption
                key={key}
                shortTitle={shortTitle}
                optionIndex={optionIndex}
                onClick={onClick}
                dialect={dialect}
                iso={iso}
              />
            );
          }}
          renderInput={(params) => {
            // console.log('renderInput', params, voice);
            const { lang = '', countryCode = '', } = voice;
            const iso = propOr({}, getIsoLangFromString(lang), ISO_LANGS);
            const dialect = propOr(
              {},
              countryCode.toLocaleLowerCase(),
              COUNTRIES
            );
            // console.log('renderInput', iso, dialect);
            params.InputProps.startAdornment = (
              <InputAdornment position="start">
                <FlagLabel
                  lang={iso}
                  country={dialect} />
              </InputAdornment>
            );
            return (
              <TextField
                {...params}
                variant="outlined"
                fullWidth={true} />
            );
          }}
        />
      </Box>
      <Grid container={true}>
        <Grid
          item={true}
          xs={12}>
          <Typography
            component="span"
            className={classes.text}
            id="discrete-slider"
            gutterBottom={true}
          >
            {t`volume`}
          </Typography>
          <Slider
            onChange={(e, value) => {
              setInputVolume(value);
              clearTimeout(timerVolume);
              timerVolume = setTimeout(() => {
                onSettingChanged(VARIABLES.SETTINGS.VOLUME, value);
              }, ATTRIBUTES.MISC.SLIDER_DEBOUNCE);
            }}
            value={inputVolume}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={DEFAULT_VALUES.SETTINGS.PARAMS.VOLUME.STEP}
            scale={(x) => x * 100}
            min={DEFAULT_VALUES.SETTINGS.PARAMS.VOLUME.MIN}
            max={DEFAULT_VALUES.SETTINGS.PARAMS.VOLUME.MAX}
          />
        </Grid>
        <Grid
          item={true}
          xs={12}>
          <Typography
            component="span"
            className={classes.text}
            id="discrete-slider"
            gutterBottom={true}
          >
            {t`rate`}
          </Typography>
          <Slider
            onChange={(_, value) => {
              setInputRate(value);
              clearTimeout(timerRate);
              timerRate = setTimeout(() => {
                onSettingChanged(VARIABLES.SETTINGS.RATE, value);
              }, ATTRIBUTES.MISC.SLIDER_DEBOUNCE);
            }}
            value={inputRate}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={DEFAULT_VALUES.SETTINGS.PARAMS.RATE.STEP}
            min={DEFAULT_VALUES.SETTINGS.PARAMS.RATE.MIN}
            max={DEFAULT_VALUES.SETTINGS.PARAMS.RATE.MAX}
          />
        </Grid>
        <Grid
          item={true}
          xs={12}>
          <Typography
            component="span"
            className={classes.text}
            id="discrete-slider"
            gutterBottom={true}
          >
            {t`pitch`}
          </Typography>
          <Slider
            onChange={(_, value) => {
              setInputPitch(value);
              clearTimeout(timerPitch);
              timerPitch = setTimeout(() => {
                onSettingChanged(VARIABLES.SETTINGS.PITCH, value);
              }, ATTRIBUTES.MISC.SLIDER_DEBOUNCE);
            }}
            value={inputPitch}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={DEFAULT_VALUES.SETTINGS.PARAMS.PITCH.STEP}
            min={DEFAULT_VALUES.SETTINGS.PARAMS.PITCH.MIN}
            max={DEFAULT_VALUES.SETTINGS.PARAMS.PITCH.MAX}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

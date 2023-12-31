import { InfoSharp, SettingsSharp, } from '@mui/icons-material';
import CloudUploadSharpIcon from '@mui/icons-material/CloudUploadSharp';
import {
  Tooltip, Grid, Typography, IconButton, Stack, 
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { FC, } from 'react';
import { useSelector, } from 'react-redux';

import { ATTRIBUTES, } from '@pericles/constants';
import { playerStatusSelector, settingsVisibleSelector, } from '@pericles/store';
import { isLoading, isPlaying, t, } from '@pericles/util';

import useSettings from '../hooks/useSettings';

const useStyles = makeStyles(() => ({
  root: {
    minHeight: 35,
    justifyContent: 'center',
  },
  text: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  infoIconBoxStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextBoxStyle: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const HeaderComponent: FC = () => {
  const classes = useStyles();
  const visible = useSelector(settingsVisibleSelector);
  const status = useSelector(playerStatusSelector);
  const { setVisible, } = useSettings();

  const documentViewerURL = `${ATTRIBUTES.WEBSITE.URL}document-viewer`;

  let statusText = t('press_play_start');
  if (isLoading(status)) {
    statusText = t('loading_audio');
  } else if (isPlaying(status)) {
    statusText = t('playing_audio');
  }

  return (
    <Grid
      container={true}
      spacing={0}
      alignItems="center"
      alignContent="center"
      className={classes.root}
    >
      <Grid
        item={true}
        xs={9}>
        <Grid
          container={true}
          alignItems="center"
          alignContent="center"
          className={classes.root}
        >
          <Grid
            item={true}
            xs={2}
            alignItems="center"
            className={classes.infoIconBoxStyle}
          >
            <InfoSharp color="info" />
          </Grid>
          <Grid
            item={true}
            xs={10}
            className={classes.infoTextBoxStyle}>
            <Typography
              className={classes.text}
              component="span">
              {statusText}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item={true}
        xs={3}>
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={0}>
          <div>
            <a
              rel="noopener noreferrer"
              href={documentViewerURL}
              target="_blank"
            >
              <Tooltip title="Upload PDF">
                <IconButton
                  color="primary"
                  size="small"
                  edge="end">
                  <CloudUploadSharpIcon />
                </IconButton>
              </Tooltip>
            </a>
          </div>
          <div>
            <Tooltip title="Change settings">
              <IconButton
                onClick={() => setVisible(!visible)}
                edge="end"
                size="small"
                color="primary"
              >
                <SettingsSharp />
              </IconButton>
            </Tooltip>
          </div>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default HeaderComponent;

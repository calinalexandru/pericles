import { BackupSharp, } from '@mui/icons-material';
import {
  Link,
  Typography,
  Button,
  Paper,
  Tooltip,
  IconButton,
  Alert,
  AlertTitle,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useDispatch, } from 'react-redux';

import { ATTRIBUTES, } from '@pericles/constants';
import { appActions, playerActions, } from '@pericles/store';

const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: '5px 0',
  },
}));

const defaultURL = `${ATTRIBUTES.WEBSITE.URL}bug-report?incidentUrl=`;
const documentViewerURL = `${ATTRIBUTES.WEBSITE.URL}document-viewer`;

const ErrorPage: React.FC = () => {
  const cls = useStyles();

  const dispatch = useDispatch();
  const onErrorClose = () => {
    dispatch(playerActions.set({ buffering: false, }));
    dispatch(playerActions.stop());
    dispatch(appActions.routeIndex());
  };

  return (
    <>
      <Alert severity="error">
        <AlertTitle>Something went wrong!</AlertTitle>
        <Typography>
          Refresh this page and try again or{' '}
          <Link
            href={defaultURL}
            rel="noopener noreferrer"
            target="_blank"
            onClick={onErrorClose}
          >
            report bug
          </Link>
          .
        </Typography>
      </Alert>
      <Alert severity="info">
        <Typography>
          Trying to read PDF?
          <br /> Click&nbsp;&nbsp;
          <Link
            onClick={onErrorClose}
            rel="noopener noreferrer"
            href={documentViewerURL}
            target="_blank"
          >
            <Tooltip title="Upload PDF">
              <IconButton
                onClick={() => {}}
                size="small">
                <BackupSharp />
              </IconButton>
            </Tooltip>
          </Link>
          &nbsp;&nbsp;to upload & view your document.
        </Typography>
      </Alert>
      <Paper className={cls.paper}>
        <Button
          color="primary"
          variant="contained"
          onClick={onErrorClose}>
          Ok
        </Button>
      </Paper>
    </>
  );
};

export default ErrorPage;

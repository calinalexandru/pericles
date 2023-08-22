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
import { func, string, } from 'prop-types';
import React from 'react';
import { connect, } from 'react-redux';

import { ATTRIBUTES, } from '@pericles/constants';
import { playerActions, routeIndex, } from '@pericles/store';

const { player, } = playerActions;
const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: '5px 0',
  },
}));

function ErrorPage({ bugReportUrl, onErrorClose, }) {
  const defaultURL = `${ATTRIBUTES.WEBSITE.URL}bug-report?incidentUrl=`;
  const cls = useStyles();
  const documentViewerURL = `${ATTRIBUTES.WEBSITE.URL}document-viewer`;
  return (
    <>
      <Alert severity="error">
        <AlertTitle>Something went wrong!</AlertTitle>
        <Typography>
          Refresh this page and try again or{' '}
          <Link
            href={bugReportUrl || defaultURL}
            rel="noopener noreferrer"
            target="_blank"
            onClick={() => {
              onErrorClose();
            }}
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
            onClick={() => {
              onErrorClose();
            }}
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
          onClick={() => {
            onErrorClose();
          }}
        >
          Ok
        </Button>
      </Paper>
    </>
  );
}

ErrorPage.propTypes = {
  bugReportUrl: string,
  onErrorClose: func,
};

ErrorPage.defaultProps = {
  bugReportUrl: '',
  onErrorClose: () => {},
};

const mapStateToProps = (state) => ({ status: state.player.status, });

const mapDispatchToProps = (dispatch) => ({
  onErrorClose: () => {
    dispatch(player.set({ buffering: false, }));
    dispatch(player.stop());
    dispatch(routeIndex());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPage);

import { BackupSharp, } from '@mui/icons-material';
import {
  Typography,
  Button,
  Paper,
  Tooltip,
  IconButton,
  Link,
  Alert,
  AlertTitle,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { func, } from 'prop-types';
import React from 'react';
import { connect, } from 'react-redux';

import { ATTRIBUTES, } from '@pericles/constants';
import { playerStop, routeIndex, } from '@pericles/store';

const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: '5px 0',
  },
}));

function PDFPreviewErrorPage({ onErrorClose, }) {
  const cls = useStyles();
  const documentViewerURL = `${ATTRIBUTES.WEBSITE.URL}document-viewer`;
  return (
    <>
      <Alert severity="error">
        <AlertTitle>
          PDF files cannot be read directly in the browser.
        </AlertTitle>
        <Typography>
          Click&nbsp;&nbsp;
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
          fullWidth={true}
          variant="contained"
          onClick={() => {
            onErrorClose();
            // window.close();
          }}
        >
          Ok
        </Button>
      </Paper>
    </>
  );
}

PDFPreviewErrorPage.propTypes = {
  onErrorClose: func,
};

PDFPreviewErrorPage.defaultProps = {
  onErrorClose: () => {},
};

const restartPlayer = () => (dispatch) => {
  dispatch(playerStop());
  dispatch(routeIndex());
};

const mapDispatchToProps = (dispatch) => ({
  onErrorClose: () => {
    restartPlayer()(dispatch);
  },
});

export default connect(null, mapDispatchToProps)(PDFPreviewErrorPage);

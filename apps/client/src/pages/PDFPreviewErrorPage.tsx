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
import React from 'react';
import { useDispatch, } from 'react-redux';

import { ATTRIBUTES, } from '@pericles/constants';
import { appActions, playerStop, } from '@pericles/store';

const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    justifyContent: 'center',
    padding: '5px 0',
  },
}));

const documentViewerURL = `${ATTRIBUTES.WEBSITE.URL}document-viewer`;
const PDFPreviewErrorPage: React.FC = () => {
  const dispatch = useDispatch();
  const cls = useStyles();

  const handleOnClick = () => {
    dispatch(playerStop());
    dispatch(appActions.routeIndex());
  };

  return (
    <>
      <Alert severity="error">
        <AlertTitle>
          PDF files cannot be read directly in the browser.
        </AlertTitle>
        <Typography>
          Click&nbsp;&nbsp;
          <Link
            onClick={handleOnClick}
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
          onClick={handleOnClick}
        >
          Ok
        </Button>
      </Paper>
    </>
  );
};

export default PDFPreviewErrorPage;

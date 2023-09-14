import {
  Typography, Button, Paper, Alert, AlertTitle, 
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useDispatch, } from 'react-redux';

import { playerStop, } from '@pericles/store';
// import { mpToContent, } from '@pericles/util';

const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: '5px 0',
  },
}));

const GooglePreviewErrorPage: React.FC = () => {
  const onReadyAnyway = async () => {
    // mpToContent('getSections');
  };

  const cls = useStyles();

  // Use useDispatch instead of mapDispatchToProps
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(playerStop());
    window.close();
  };

  return (
    <>
      <Alert severity="warning">
        <AlertTitle>Google Drive preview notice</AlertTitle>
        <Typography>
          Reading in preview mode restricts some features. Open the document
          with Google Docs for the best reading experience.
        </Typography>
      </Alert>
      <Paper className={cls.paper}>
        <Button
          color="primary"
          variant="contained"
          onClick={handleClose}>
          Ok
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={onReadyAnyway}>
          Read anyway
        </Button>
      </Paper>
    </>
  );
};

export default GooglePreviewErrorPage;

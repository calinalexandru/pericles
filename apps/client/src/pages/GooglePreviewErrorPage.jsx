import {
  Typography, Button, Paper, Alert, AlertTitle, 
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { func, } from 'prop-types';
import React from 'react';
import { connect, } from 'react-redux';

import { playerActions, } from '@pericles/store';
import { mpToContent, } from '@pericles/util';

const { player, } = playerActions;
const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: '5px 0',
  },
}));

function GooglePreviewErrorPage({ onErrorClose, }) {
  const onReadyAnyway = async () => {
    mpToContent('getSections');
  };
  const cls = useStyles();
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
          onClick={() => {
            onErrorClose();
            window.close();
          }}
        >
          Ok
        </Button>
        <Button
          color="secondary"
          className="danger"
          variant="contained"
          onClick={onReadyAnyway}
        >
          Read anyway
        </Button>
      </Paper>
    </>
  );
}

GooglePreviewErrorPage.propTypes = {
  onErrorClose: func,
};

GooglePreviewErrorPage.defaultProps = {
  onErrorClose: () => {},
};

const mapStateToProps = (state) => ({ status: state.player.status, });

const mapDispatchToProps = (dispatch) => ({
  onErrorClose: () => {
    dispatch(player.stop());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GooglePreviewErrorPage);

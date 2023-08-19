import { PhoneBluetoothSpeakerTwoTone, } from '@mui/icons-material';
import { Button, } from '@mui/material';
import { string, node, func, } from 'prop-types';
import React from 'react';

export default function LoginWithButton({ onClick, icon, text, }) {
  return (
    <Button
      fullWidth={true}
      variant="outlined"
      onClick={onClick}
      sx={{
        textTransform: 'none',
        justifyContent: 'flex-start',
        paddingLeft: 10,
      }}
      startIcon={icon}
    >
      {text}
    </Button>
  );
}

LoginWithButton.propTypes = {
  onClick: func,
  icon: node,
  text: string,
};

LoginWithButton.defaultProps = {
  onClick: () => {},
  icon: <PhoneBluetoothSpeakerTwoTone />,
  text: 'Login with Blank',
};

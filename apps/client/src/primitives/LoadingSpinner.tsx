import { Box, CircularProgress, } from '@mui/material';
import React from 'react';

const boxStyles = {
  display: 'flex',
  height: '100vh',
  justifyContent: 'center',
  alignItems: 'center',
};

const circularProgressStyles = {
  display: 'flex',
};

const LoadingSpinner: React.FC = () => (
  <Box sx={boxStyles}>
    <CircularProgress sx={circularProgressStyles} />
  </Box>
);

export default LoadingSpinner;

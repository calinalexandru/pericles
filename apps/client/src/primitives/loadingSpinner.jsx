import { Box, CircularProgress, } from '@mui/material';
import React from 'react';

export default function LoadingSpinner() {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress sx={{ display: 'flex', }} />
    </Box>
  );
}

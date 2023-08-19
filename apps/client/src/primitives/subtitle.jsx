import { Typography, } from '@mui/material';
import { node, } from 'prop-types';
import React from 'react';

export default function Subtitle({ children, }) {
  return (
    <Typography
      sx={{
        textTransform: 'uppercase',
        fontSize: '0.7rem',
        letterSpacing: '0.03rem',
        fontWeight: '300',
        margin: '20px 0 10px 0',
        color: 'rgb(111, 126, 140)',
      }}
      variant="subtitle1"
      component="p"
      gutterBottom={true}
    >
      {children}
    </Typography>
  );
}

Subtitle.propTypes = {
  children: node,
};

Subtitle.defaultProps = {
  children: [],
};

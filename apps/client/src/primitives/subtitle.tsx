import { Typography, } from '@mui/material';
import React, { ReactNode, } from 'react';

interface SubtitleProps {
  children?: ReactNode;
}

const typographyStyles = {
  textTransform: 'uppercase',
  fontSize: '0.7rem',
  letterSpacing: '0.03rem',
  fontWeight: '300',
  margin: '20px 0 10px 0',
  color: 'rgb(111, 126, 140)',
};

const Subtitle: React.FC<SubtitleProps> = ({ children, }) => (
  <Typography
    sx={typographyStyles}
    variant="subtitle1"
    component="p"
    gutterBottom={true}
  >
    {children}
  </Typography>
);

Subtitle.defaultProps = {
  children: [],
};

export default Subtitle;

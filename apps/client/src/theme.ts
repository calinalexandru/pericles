import { grey, } from '@mui/material/colors';

export const paletteLight = {
  mode: 'light',
  divider: grey[400],
  background: {
    default: grey[50],
    paper: grey[100],
  },
  text: {
    primary: grey[900],
    secondary: grey[800],
  },
  primary: {
    main: '#082E8B',
    light: '#4e57bc',
    dark: '#000a5d',
  },
  secondary: {
    main: '#f0f0f0',
    light: '#082E8B',
    dark: '#cccccc',
  },
  tertiary: {
    main: '#999',
    light: '#e9e9e9',
    dark: '#031a54',
  },
};

export const paletteDark = {
  mode: 'dark',
  divider: grey[800],
  common: {
    black: '#111',
    white: '#c9d1d9',
  },
  background: {
    default: '#161c26',
    paper: '#111',
  },
  text: {
    primary: '#c9d1d9',
    secondary: grey[500],
  },
  info: {
    main: '#569cd6',
    light: '#ccc',
    dark: '#333',
  },
  warning: {
    light: '#564429',
    main: '#563b13',
  },
  primary: {
    light: '#161a22',
    main: '#9aa0a6',
  },
  secondary: {
    light: '#222',
    main: '#c9d1d9',
  },
  tertiary: {
    main: '#666',
    light: '#111',
  },
};

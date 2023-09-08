import {
  Backdrop, Button, FormControl, SxProps, 
} from '@mui/material';
import React, { useState, MouseEvent, } from 'react';
import { RgbaStringColorPicker, } from 'react-colorful';

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
}

const formControlSx = { position: 'static', mx: 1, } as SxProps;

const buttonSx = {
  bgcolor: (props: ColorPickerProps) => props.value,
  border: 1,
  borderColor: 'primary.dark',
  minWidth: 'unset',
  width: 40,
} as SxProps;

const backdropSx = {
  backgroundColor: 'rgba(0,0,0, 0.9)',
  zIndex: 999,
} as SxProps;

const rgbaStringStyle = {
  position: 'absolute',
  top: '15%',
} as React.CSSProperties;

const ColorPicker: React.FC<ColorPickerProps> = ({
  value = '',
  onChange = () => {},
}) => {
  const [ show, setShow, ] = useState(false);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === null) return;
    const classList = Array.from((e.target as HTMLElement).classList).join(',');
    if (classList.indexOf('react-colorful') !== -1) return;
    setShow(false);
  };

  return (
    <FormControl sx={formControlSx}>
      <Button
        size="small"
        sx={buttonSx}
        onClick={() => {
          setShow(!show);
        }}
      >
        &nbsp;
      </Button>
      <Backdrop
        open={show}
        sx={backdropSx}
        onClick={handleBackdropClick}>
        <RgbaStringColorPicker
          style={rgbaStringStyle}
          color={value}
          onChange={onChange}
        />
      </Backdrop>
    </FormControl>
  );
};

export default ColorPicker;

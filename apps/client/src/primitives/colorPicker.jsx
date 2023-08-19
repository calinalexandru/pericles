import { Backdrop, Button, FormControl, } from '@mui/material';
import { func, string, } from 'prop-types';
import React, { useState, } from 'react';
import { RgbaStringColorPicker, } from 'react-colorful';

export default function ColorPicker({ value, onChange, }) {
  const [ show, setShow, ] = useState(false);
  return (
    <FormControl sx={{ position: 'static', mx: 1, }}>
      <Button
        size="small"
        sx={{
          bgcolor: value,
          border: 1,
          borderColor: 'primary.dark',
          minWidth: 'unset',
          width: 40,
        }}
        onClick={() => {
          setShow(!show);
        }}
      >
        &nbsp;
      </Button>
      <Backdrop
        open={show}
        sx={{
          backgroundColor: 'rgba(0,0,0, 0.9)',
          zIndex: 999,
        }}
        onClick={(e) => {
          const classList = Array.from(e.target.classList).join(',');
          // console.log('classList', classList);
          if (classList.indexOf('react-colorful') !== -1) return;
          // console.log('backdrop.click', e);
          setShow(false);
        }}
      >
        <RgbaStringColorPicker
          style={{
            position: 'absolute',
            top: '15%',
          }}
          color={value}
          onChange={onChange}
        />
      </Backdrop>
    </FormControl>
  );
  // return (
  //   <input
  //     style={{
  //       border: 'none',
  //       maxWidth: '40px',
  //     }}
  //     type="color"
  //     value={value}
  //     onChange={onChange}
  //   />
  // );
}

ColorPicker.propTypes = {
  value: string,
  onChange: func,
};

ColorPicker.defaultProps = {
  value: '',
  onChange: () => {},
};

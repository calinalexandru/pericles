import { VolumeUpSharp, } from '@mui/icons-material';
import { Button, IconButton, } from '@mui/material';
import {
  string, objectOf, array, oneOfType, number, func, 
} from 'prop-types';
import React, { memo, } from 'react';

import FlagLabel from '@/primitives/flag/index';

const AutocompleteOption = ({
  iso,
  dialect,
  shortTitle,
  onClick,
  optionIndex,
  ...rest
}) => (
  <div
    style={{
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'flex-start',
      ...rest.style,
    }}
  >
    <Button
      variant="text"
      data-option-index={optionIndex}
      onClick={onClick}
      sx={{
        fontSize: 'inherit',
        textTransform: 'initial',
        color: 'text.primary',
        width: '82%',
        justifyContent: 'flex-start',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      <FlagLabel
        lang={iso}
        country={dialect}
        title={shortTitle} />
      {iso.nativeName ? ` (${iso.nativeName})` : ''}
    </Button>
    <IconButton
      style={{ visibility: 'hidden', }}
      onClick={() => {
        console.log('render voice audio example');
        return false;
      }}
    >
      <VolumeUpSharp />
    </IconButton>
  </div>
);

AutocompleteOption.propTypes = {
  optionIndex: number,
  iso: objectOf(string),
  dialect: objectOf(oneOfType([ string, array, ])),
  shortTitle: string,
  onClick: func,
};

AutocompleteOption.defaultProps = {
  optionIndex: 0,
  iso: {},
  dialect: {},
  shortTitle: '',
  onClick: () => {},
};

export default memo(AutocompleteOption);

import { VolumeUpSharp, } from '@mui/icons-material';
import { Button, IconButton, } from '@mui/material';
import React, { FC, useMemo, } from 'react';

import FlagLabel from '@/primitives/Flag/Flag';
import { CountryType, IsoLangType, } from '@pericles/constants';

interface AutocompleteOptionProps {
  optionIndex?: number;
  iso?: IsoLangType;
  dialect?: CountryType;
  shortTitle?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const divStyle: React.CSSProperties = {
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-start',
};

const buttonSx = {
  fontSize: 'inherit',
  textTransform: 'initial' as const,
  color: 'text.primary',
  width: '82%',
  justifyContent: 'flex-start',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const iconButtonStyle: React.CSSProperties = {
  visibility: 'hidden',
};

const AutocompleteOption: FC<AutocompleteOptionProps> = ({
  iso = {},
  dialect = {},
  shortTitle = '',
  onClick = () => {},
  optionIndex = 0,
  style,
}) => {
  const mergedStyle = useMemo(() => ({ ...divStyle, ...style, }), [ style, ]);

  return (
    <div style={mergedStyle}>
      <Button
        variant="text"
        data-option-index={optionIndex}
        onClick={onClick}
        sx={buttonSx}
      >
        <FlagLabel
          lang={iso}
          country={dialect}
          title={shortTitle} />
        {iso.nativeName ? ` (${iso.nativeName})` : ''}
      </Button>
      <IconButton
        style={iconButtonStyle}
        onClick={() => {
          console.log('render voice audio example');
          return false;
        }}
      >
        <VolumeUpSharp />
      </IconButton>
    </div>
  );
};

export default React.memo(AutocompleteOption);

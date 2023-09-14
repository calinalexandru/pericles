import { FlagSharp, } from '@mui/icons-material';
import React, { useMemo, } from 'react';

import { FlagImg, } from './style';

interface FlagProps {
  lang?: {
    flag?: string;
    name?: string;
  };
  country?: {
    flag?: string;
    name?: string;
  };
  title?: string;
}

const containerStyle = {
  display: 'inline',
  position: 'relative',
  marginRight: '4px',
} as React.CSSProperties;

const flagSharpStyle = { width: '30px', };

const Flag: React.FC<FlagProps> = ({ lang = {}, country = {}, title = '', }) => {
  const hasLang = Object.keys(lang).length > 0;
  const hasCountry = Object.keys(country).length > 0;

  const langImageSrc = useMemo(() => {
    if (hasLang && lang.flag) {
      return `https://getpericles.com/flags/${lang.flag}`;
    }
    return '';
  }, [ lang, hasLang, ]);

  const countryImageSrc = useMemo(() => {
    if (hasCountry && country.flag && lang.flag !== country.flag) {
      return `https://getpericles.com/flags/${country.flag}`;
    }
    return '';
  }, [ country, lang, hasCountry, ]);

  return (
    <>
      <div style={containerStyle}>
        {hasLang && langImageSrc ? (
          <FlagImg
            src={langImageSrc}
            size="big" />
        ) : (
          <FlagSharp sx={flagSharpStyle} />
        )}
        {hasLang && hasCountry && countryImageSrc ? (
          <FlagImg
            src={countryImageSrc}
            size="small" />
        ) : null}
      </div>
      {title}
    </>
  );
};

export default Flag;

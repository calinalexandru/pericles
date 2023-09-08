import { FlagSharp, } from '@mui/icons-material';
import {
  string, objectOf, array, oneOfType, 
} from 'prop-types';
import { keys, length, } from 'ramda';
import React from 'react';

import { FlagImg, } from './style';

const Flag = ({ lang, country, title, }) => (
  <>
    <div
      style={{
        display: 'inline',
        position: 'relative',
        marginRight: '4px',
      }}
    >
      {length(keys(lang)) && lang.flag ? (
        <FlagImg
          src={`https://getpericles.com/flags/${lang.flag}`}
          // alt={lang.name}
          size="big"
        />
      ) : (
        <FlagSharp sx={{ width: '30px', }} />
      )}
      {length(keys(lang)) &&
      length(keys(country)) &&
      lang.flag !== country.flag ? (
        <FlagImg
            src={`https://getpericles.com/flags/${country.flag}`}
            // alt={country.flag}
            size="small"
          />
        ) : null}
    </div>
    {title}
  </>
);

Flag.propTypes = {
  lang: objectOf(string),
  country: objectOf(oneOfType([ string, array, ])),
  title: string,
};

Flag.defaultProps = {
  lang: {},
  country: {},
  title: '',
};

export default Flag;

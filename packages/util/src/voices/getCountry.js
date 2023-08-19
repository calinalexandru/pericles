import { propOr, } from 'ramda';

import { COUNTRIES, } from '@pericles/constants';

export default function getCountry(country) {
  return propOr({}, country.toLocaleLowerCase(), COUNTRIES);
}

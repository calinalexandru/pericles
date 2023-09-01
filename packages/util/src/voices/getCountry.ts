import { COUNTRIES, CountryType, } from '@pericles/constants';

export default function getCountry(country: string): CountryType {
  return COUNTRIES?.[country.toLocaleLowerCase()] || COUNTRIES.us;
}

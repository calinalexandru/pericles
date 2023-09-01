import { CountryType, } from '@pericles/constants';

export default function getTagsFromCountry(country: CountryType): string[] {
  return country.tags;
}

import { propOr, } from 'ramda';

export default function getTagsFromCountry(country) {
  return propOr([], 'tags', country);
}

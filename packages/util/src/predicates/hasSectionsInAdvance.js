import { ATTRIBUTES, } from '@pericles/constants';

export default function hasSectionsInAdvance(sections = [], key = 0) {
  return sections.length - 1 > key + ATTRIBUTES.MISC.MIN_SECTIONS;
}

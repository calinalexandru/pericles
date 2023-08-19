import { ATTRIBUTES, } from '@pericles/constants';

export default function sectionQuerySelector(id) {
  return `${ATTRIBUTES.TAGS.SECTION}[${ATTRIBUTES.ATTRS.SECTION}="${id}"]`;
}

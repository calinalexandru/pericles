import { ATTRIBUTES, } from '@pericles/constants';

export default function rectSectionQuerySelector(id) {
  return `${ATTRIBUTES.TAGS.RECT}[${ATTRIBUTES.ATTRS.SECTION}="${id}"]`;
}

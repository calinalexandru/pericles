import { ATTRIBUTES, } from '@pericles/constants';

export default function rectSectionQuerySelector(id: number): string {
  return `${ATTRIBUTES.TAGS.RECT}[${ATTRIBUTES.ATTRS.SECTION}="${id}"]`;
}

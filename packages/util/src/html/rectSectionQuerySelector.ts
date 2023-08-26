import { ATTRIBUTES, } from '@pericles/constants';

export default function rectSectionQuerySelector(id: string): string {
  return `${ATTRIBUTES.TAGS.RECT}[${ATTRIBUTES.ATTRS.SECTION}="${id}"]`;
}

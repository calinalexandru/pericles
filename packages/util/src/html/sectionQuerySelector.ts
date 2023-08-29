import { ATTRIBUTES, } from '@pericles/constants';

export default function sectionQuerySelector(id: number): string {
  return `${ATTRIBUTES.TAGS.SECTION}[${ATTRIBUTES.ATTRS.SECTION}="${id}"]`;
}

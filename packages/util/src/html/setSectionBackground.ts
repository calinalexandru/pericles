import { ATTRIBUTES, } from '@pericles/constants';

import getSelfIframes from './getSelfIframes';

export default function setSectionBackground(color: string): void {
  try {
    document
      .querySelector<HTMLElement>(':root')
      ?.style?.setProperty?.(ATTRIBUTES.ATTRS.SECTION_BACKGROUND, color);
    getSelfIframes().forEach((iframe) => {
      iframe.document
        .querySelector<HTMLElement>(':root')
        ?.style?.setProperty?.(ATTRIBUTES.ATTRS.SECTION_BACKGROUND, color);
    });
  } catch (e) {
    console.warn('could not update section color', e);
  }
}

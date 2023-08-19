import { ATTRIBUTES, } from '@pericles/constants';

import getSelfIframes from './getSelfIframes';

export default function setWordBackground(color) {
  try {
    document
      .querySelector(':root')
      .style.setProperty(ATTRIBUTES.ATTRS.WORD_BACKGROUND, color);
    getSelfIframes().forEach((iframe) => {
      iframe.document
        .querySelector(':root')
        .style.setProperty(ATTRIBUTES.ATTRS.WORD_BACKGROUND, color);
    });
  } catch (e) {
    console.warn('could not update word color', e);
  }
}

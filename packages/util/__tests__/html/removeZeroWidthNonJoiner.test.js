/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import removeHTMLSpaces from '../../src/html/removeHTMLSpaces';

describe('removeZeroWidthNonJoiner', () => {
  test('removes zero width joiners', () => {
    const trash = `a${String.fromCharCode(0x200b)}${String.fromCharCode(
      0x200c
    )}b${String.fromCharCode(0x200d)}c`;

    const trashLength = trash.length;
    expect(trashLength).toBe(6);

    expect(removeHTMLSpaces(trash)).toBe('abc');
    expect(removeHTMLSpaces(trash).length).toBe(3);
  });
});

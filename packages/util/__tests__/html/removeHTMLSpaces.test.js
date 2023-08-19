/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import removeHTMLSpaces from '../../src/html/removeHTMLSpaces';

describe('removeHTMLSpaces', () => {
  test('trims', () => {
    expect(removeHTMLSpaces(' some ')).toBe('some');
  });

  test('removes zero width joiner', () => {
    expect(removeHTMLSpaces(String.fromCharCode(0x200d))).toBe('');
  });

  test('removes white spaces &nbsp;', () => {
    expect(removeHTMLSpaces('&nbsp;  &nbsp;')).toBe('  ');
  });
});

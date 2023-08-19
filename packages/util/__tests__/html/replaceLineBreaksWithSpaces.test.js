/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import replaceLineBreaksWithSpaces from '../../src/html/replaceLineBreaksWithSpaces';

describe('replaceLineBreaksWithSpaces', () => {
  test('new line', () => {
    expect(replaceLineBreaksWithSpaces('\n')).toBe(' ');
  });

  test('tab', () => {
    expect(replaceLineBreaksWithSpaces('\t')).toBe(' ');
  });

  test('tab and newline inside string', () => {
    expect(replaceLineBreaksWithSpaces('a\nb\tc')).toBe('a b c');
  });

  test('tab and newline inside string #2', () => {
    expect(replaceLineBreaksWithSpaces('a\n\tb')).toBe('a  b');
  });

  test('tab and newline inside string #3', () => {
    expect(replaceLineBreaksWithSpaces('\n\t\t\t\n')).toBe('     ');
  });
});

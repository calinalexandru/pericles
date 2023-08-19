/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import replaceLineBreaks from '../../src/html/replaceLineBreaks';

/**
 *
 */
describe('replaceLineBreaks', () => {
  test('new line', () => {
    expect(replaceLineBreaks('\n')).toBe('  ');
  });

  test('new line and return carriage', () => {
    expect(replaceLineBreaks('\n\r')).toBe('  ');
  });

  test('new line and return carriage inside string', () => {
    expect(replaceLineBreaks('a\n\rb')).toBe('a  b');
  });
});

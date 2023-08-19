/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import hasChildNodes from '../../src/html/hasChildNodes';

/**
 *
 */
describe('hasChildNodes', () => {
  test('empty childen list', () => {
    expect(hasChildNodes({ childNodes: [] })).toBe(false);
  });

  test('filled childNodes list', () => {
    expect(hasChildNodes({ childNodes: [1, 2, 3, 4, 5] })).toBe(true);
  });
});

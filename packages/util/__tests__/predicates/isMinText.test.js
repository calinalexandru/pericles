/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import isMinText from '../../src/predicates/isMinText';

describe('isMinText', () => {
  test('parsing states', () => {
    expect(isMinText('abcd')).toBe(true);
    expect(isMinText('a')).toBe(false);
  });
  test('invalid inputs', () => {
    expect(isMinText({})).toBe(false);
  });
});

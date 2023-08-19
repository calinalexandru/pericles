/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import isValidTag from '../../src/predicates/isValidTag';

describe('isValidTag', () => {
  test('parsing states', () => {
    expect(isValidTag({ tagName: 'DIV' })).toBe(true);
    expect(isValidTag({ tagName: 'SPAN' })).toBe(true);
    expect(isValidTag({ tagName: 'SCRIPT' })).toBe(false);
    expect(isValidTag({ tagName: 'STYLE' })).toBe(false);
  });

  test('invalid inputs', () => {
    expect(isValidTag({})).toBe(true);
  });
});

/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import { ATTRIBUTES } from '@pericles/constants';
import isMaxText from '../../src/predicates/isMaxText';

describe('isMaxText', () => {
  test('parsing states', () => {
    expect(isMaxText('abcd')).toBe(false);
    expect(isMaxText(Array(ATTRIBUTES.MISC.MAX_TEXT).fill('a').join(''))).toBe(
      true
    );
    expect(
      isMaxText(
        Array(ATTRIBUTES.MISC.MAX_TEXT + 1)
          .fill('a')
          .join('')
      )
    ).toBe(true);
  });
  test('invalid inputs', () => {
    expect(isMaxText(undefined)).toBe(false);
    expect(isMaxText(null)).toBe(false);
  });
});

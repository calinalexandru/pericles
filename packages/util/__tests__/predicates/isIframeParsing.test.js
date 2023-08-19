/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import isIframeParsing from '../../src/predicates/isIframeParsing';

describe('isIframeParsing', () => {
  test('parsing states', () => {
    expect(isIframeParsing({ parsing: true })).toBe(true);
    expect(isIframeParsing({ parsing: false })).toBe(false);
    expect(isIframeParsing()).toBe(false);
  });
  test('invalid inputs', () => {
    expect(isIframeParsing(null)).toBe(false);
    expect(isIframeParsing(undefined)).toBe(false);
    expect(isIframeParsing(10)).toBe(false);
    expect(isIframeParsing(-10)).toBe(false);
    expect(isIframeParsing(new Map())).toBe(false);
    expect(isIframeParsing(Infinity)).toBe(false);
  });
});

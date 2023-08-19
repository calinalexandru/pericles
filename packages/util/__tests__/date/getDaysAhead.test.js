/**
 * @jest-environment jsdom
 */

import { test, expect, describe } from '@jest/globals';
import getDaysAhead from '../../src/date/getDaysAhead';

describe('getDaysAhead', () => {
  test('valid inputs', () => {
    expect(getDaysAhead(1)).toBeGreaterThan(new Date().getTime());
    expect(getDaysAhead(2)).toBeGreaterThan(new Date().getTime());
    expect(getDaysAhead(0)).toBeLessThanOrEqual(new Date().getTime());
  });

  test('invalid inputs', () => {
    expect(getDaysAhead(null)).toBeLessThanOrEqual(new Date().getTime());
    expect(getDaysAhead(undefined)).toBeLessThanOrEqual(new Date().getTime());
    // expect(getDaysAhead(-1)).toBeGreaterThanOrEqual(new Date().getTime());
    // expect(getDaysAhead(Infinity)).toBeGreaterThanOrEqual(new Date().getTime());
  });
});

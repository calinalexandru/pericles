/**
 * @jest-environment jsdom
 */

import { test, expect, describe } from '@jest/globals';
import getSectionByKey from '../../src/helpers/getSectionByKey';

describe('getSectionByKey', () => {
  test('correct section is returned', () => {
    expect(getSectionByKey(1, [0, 1, 2, 3, 4, 5])).toBe(1);
    expect(getSectionByKey(2, [0, 1, 2, 3, 4, 5])).toBe(2);
    expect(getSectionByKey(3, [0, 1, 2, 3, 4, 5])).toBe(3);
  });

  test('invalid inputs', () => {
    expect(getSectionByKey(undefined, [])).toBe(undefined);
    expect(getSectionByKey(null, [])).toBe(undefined);
    expect(getSectionByKey(1, [])).toBe(undefined);
    expect(getSectionByKey(-1, [])).toBe(undefined);
    expect(getSectionByKey(undefined, null)).toBe(undefined);
    expect(getSectionByKey(null, undefined)).toBe(undefined);
    expect(getSectionByKey(1, Infinity)).toBe(undefined);
    expect(getSectionByKey(-1, new Map())).toBe(undefined);
  });
});

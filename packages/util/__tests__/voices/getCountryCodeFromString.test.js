/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import getCountryCodeFromString from '../../src/voices/getCountryCodeFromString';

describe('getCountryCodeFromString', () => {
  test('parsing states', () => {
    expect(getCountryCodeFromString('RO-ro')).toBe('RO');
    expect(getCountryCodeFromString('EN-gb')).toBe('GB');
    expect(getCountryCodeFromString('EN-us')).toBe('US');
    expect(getCountryCodeFromString('ro')).toBe('RO');
    expect(getCountryCodeFromString('usa')).toBe('USA');
  });
  test('invalid inputs', () => {
    expect(getCountryCodeFromString(undefined)).toBe(false);
    expect(getCountryCodeFromString(false)).toBe(false);
    expect(getCountryCodeFromString(0)).toBe(false);
    expect(getCountryCodeFromString(1)).toBe(undefined);
  });
});

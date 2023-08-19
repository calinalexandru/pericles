/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import getIsoLangFromString from '../../src/voices/getIsoLangFromString';

describe('getIsoLangFromString', () => {
  test('parsing states', () => {
    expect(getIsoLangFromString('RO-ro')).toBe('ro');
    expect(getIsoLangFromString('EN-gb')).toBe('en');
    expect(getIsoLangFromString('EN-us')).toBe('en');
    expect(getIsoLangFromString('ro')).toBe('ro');
    expect(getIsoLangFromString('usa')).toBe('usa');
  });
  test('invalid inputs', () => {
    expect(getIsoLangFromString(undefined)).toBe(false);
    expect(getIsoLangFromString(false)).toBe(false);
    expect(getIsoLangFromString(0)).toBe(false);
    expect(getIsoLangFromString(1)).toBe(undefined);
  });
});

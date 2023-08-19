/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import getEnglishVoiceKey from '../../src/voices/getEnglishVoiceKey';

describe('getEnglishVoiceKey', () => {
  test('parsing states', () => {
    expect(
      getEnglishVoiceKey([
        {
          text: 'ion moldovoneasca',
        },
        {
          text: 'ion romana',
        },
        {
          text: 'aria online',
        },
      ])
    ).toBe(2);
    expect(
      getEnglishVoiceKey([
        {
          text: 'ion moldovoneasca',
        },
        {
          text: 'google us english',
        },
        {
          text: 'ion romana',
        },
      ])
    ).toBe(1);
    expect(
      getEnglishVoiceKey([
        {
          text: 'ion moldovoneasca',
        },
        {
          text: 'daniel',
        },
        {
          text: 'ion romana',
        },
      ])
    ).toBe(1);
    expect(
      getEnglishVoiceKey([
        {
          text: 'aria online',
        },
        {
          text: 'english',
        },
        {
          text: 'google us english',
        },
      ])
    ).toBe(2);
  });
  test('invalid inputs', () => {
    expect(getEnglishVoiceKey(false)).toBe(0);
    expect(getEnglishVoiceKey(undefined)).toBe(0);
  });
});

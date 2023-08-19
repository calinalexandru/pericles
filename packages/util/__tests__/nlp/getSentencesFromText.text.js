/**
 * @jest-environment jsdom
 */
import { describe, expect, test } from '@jest/globals';

describe('getSentencesFromText', () => {
  const getSentencesFromText = () => {};
  test('parsing states', () => {
    expect(
      getSentencesFromText(
        `What React 18 is offering us (that is so cool), are the tools to work with and manipulate that concurrency flow. Developers now have more control over rendering prioritization and order than we’ve ever had before.`
      )
    ).toStrictEqual(undefined);
  });
  test('invalid inputs', () => {
    expect(getSentencesFromText('')).toBe(undefined);
  });
});

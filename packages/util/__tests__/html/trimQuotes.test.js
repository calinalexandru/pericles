/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import trimQuotes from '../../src/html/trimQuotes';

describe('trimQuotes', () => {
  test('Quotation Mark', () => {
    expect(trimQuotes('"')).toBe('');
  });

  test('Apostrophe', () => {
    expect(trimQuotes("'")).toBe('');
  });

  test('Left Single Quotation Mark', () => {
    expect(trimQuotes('‘')).toBe('');
  });

  test('Right Single Quotation Mark', () => {
    expect(trimQuotes('’')).toBe('');
  });

  test('Left Double Quotation Mark', () => {
    expect(trimQuotes('“')).toBe('');
  });

  test('Right Double Quotation Mark', () => {
    expect(trimQuotes('”')).toBe('');
  });

  test('Double Low-9 Quotation Mark', () => {
    expect(trimQuotes('„')).toBe('');
  });

  test('Combined', () => {
    expect(trimQuotes('„ ”')).toBe(' ');
  });

  test('Leave quotes inside untouched', () => {
    const sentence = 'I was walking down „Strange Avenue” when i met her';
    expect(trimQuotes(sentence)).toBe(sentence);
  });
});

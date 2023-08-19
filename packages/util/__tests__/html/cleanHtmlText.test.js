/**
 * @jest-environment jsdom
 */

import { test, expect, describe } from '@jest/globals';
import cleanHtmlText from '../../src/html/cleanHtmlText';

describe('cleanHtmlText', () => {
  test('it cleans text', () => {
    expect(cleanHtmlText(' A b\n\r')).toBe('A b');
  });
});

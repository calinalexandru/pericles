/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import hasHtmlChildren from '../../src/html/hasChildNodes';

const container = document.createElement('div');
for (let i = 0; i < 5; i += 1) {
  container.appendChild(document.createElement('p'));
}

describe('hasHtmlChildren', () => {
  test('empty childen list', () => {
    expect(hasHtmlChildren({ childNodes: [] })).toBe(false);
  });

  test('filled children list', () => {
    expect(hasHtmlChildren(container)).toBe(true);
  });
});

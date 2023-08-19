/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import { ATTRIBUTES } from '@pericles/constants';
import alterNode from '../../src/html/alterNode';

/**
 *
 */
describe('alterNode', () => {
  test('normal types', () => {
    const para1 = document.createElement('p');
    alterNode(para1, 0);
    expect(para1.tagName).toBe('P');
    expect(para1.parentElement.tagName).toBe(
      ATTRIBUTES.TAGS.SECTION.toLocaleUpperCase()
    );
    expect(para1.parentElement.getAttribute(ATTRIBUTES.ATTRS.SECTION)).toBe(
      '0'
    );
  });

  test('against invalid types', () => {
    expect(alterNode(null, 0)).toBe(undefined);
  });
});

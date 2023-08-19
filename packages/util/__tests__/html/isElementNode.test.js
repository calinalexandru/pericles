/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import { NODE_TYPES } from '@pericles/constants';
import isElementNode from '../../src/predicates/isElementNode';

/**
 *
 */
describe('isElementNode', () => {
  test('against other types', () => {
    expect(isElementNode({ nodeType: undefined })).toBe(false);
    expect(isElementNode({ nodeType: NODE_TYPES.TEXT })).toBe(false);
  });

  test('against element type', () => {
    expect(isElementNode({ nodeType: NODE_TYPES.ELEMENT })).toBe(true);
  });
});

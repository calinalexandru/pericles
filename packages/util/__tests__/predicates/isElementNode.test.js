/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import { NODE_TYPES } from '@pericles/constants';
import isElementNode from '../../src/predicates/isElementNode';

describe('isElementNode', () => {
  test('parsing states', () => {
    expect(isElementNode({ nodeType: NODE_TYPES.ELEMENT })).toBe(true);
    expect(isElementNode({ parsing: NODE_TYPES.TEXT })).toBe(false);
  });
  test('invalid inputs', () => {
    expect(isElementNode({})).toBe(false);
  });
});

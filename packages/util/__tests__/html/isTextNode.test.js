/**
 * @jest-environment jsdom
 */
import { NODE_TYPES } from '@pericles/constants';
import { test, expect, describe } from '@jest/globals';
import isTextNode from '../../src/predicates/isTextNode';

describe('isTextNode', () => {
  test('accepted inputs', () => {
    expect(isTextNode({ nodeType: NODE_TYPES.TEXT })).toBe(true);
    expect(isTextNode({ nodeType: undefined })).toBe(false);
    expect(isTextNode({ nodeType: NODE_TYPES.ELEMENT })).toBe(false);
  });

  test('invalid inputs', () => {
    expect(isTextNode({})).toBe(false);
  });
});

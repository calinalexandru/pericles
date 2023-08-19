/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import isVisibleNode from '../../src/html/isVisibleNode';
// const { window } = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
const node = document.createElement('p').childNodes[0];

describe('isVisibleNode', () => {
  test('is not visible', () => {
    expect(isVisibleNode({ window, node })).toBe(false);
  });
});

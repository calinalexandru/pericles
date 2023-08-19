/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import findNextSibling from '../../src/html/findNextSibling';

const container = document.createElement('div');
describe('findNextSibling', () => {
  test('siblings and null', () => {
    const para1 = document.createElement('p');
    const para2 = document.createElement('p');
    container.appendChild(para1);
    container.appendChild(para2);
    expect(findNextSibling(para1)).toEqual(para2);
    expect(findNextSibling(container.childNodes[1])).toEqual(null);
  });

  test('inaccesible iframe returns next sibling after iframe', () => {
    const iframe1 = document.createElement('iframe');
    const heading = document.createElement('h1');
    container.appendChild(iframe1);
    container.appendChild(heading);
    const para1 = document.createElement('p');
    iframe1.appendChild(para1);
    expect(findNextSibling(iframe1)).toEqual(heading);
  });
});

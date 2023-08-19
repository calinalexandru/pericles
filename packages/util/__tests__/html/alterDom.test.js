/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import { ATTRIBUTES } from '@pericles/constants';
import alterDom from '../../src/html/alterDom';

/**
 *
 */
describe('alterDom', () => {
  test('normal types', () => {
    const container = document.createElement('div');
    const para1 = document.createElement('p');
    para1.textContent = 'paragraph first';
    const text1 = document.createTextNode('im just a lonely text node');
    const para2 = document.createElement('p');
    para2.textContent = 'paragraph second';
    container.appendChild(para1);
    container.appendChild(text1);
    container.appendChild(para2);
    alterDom(container, 0);
    expect(container.tagName).toBe('DIV');
    const allSections = container.querySelectorAll(ATTRIBUTES.TAGS.SECTION);
    expect(allSections.length).toBe(3);
    expect(allSections[0].parentElement).toBe(para1);
    expect(allSections[1].parentElement).toBe(container);
    expect(allSections[2].parentElement).toBe(para2);
  });

  test('against invalid types', () => {
    expect(alterDom(null, 0)).toBe(undefined);
    expect(alterDom({}, 0)).toBe(undefined);
  });
});

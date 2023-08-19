/**
 * @jest-environment jsdom
 */

import { test, expect, describe } from '@jest/globals';
import getIframesForStore from '../../src/helpers/getIframesForStore';

describe('getIframesForStore', () => {
  test('correct order is applied', () => {
    const container = document.createElement('div');
    const iframe1 = document.createElement('iframe');
    iframe1.setAttribute('src', 'http://wikipedia.org/');
    container.appendChild(iframe1);
    const iframe2 = document.createElement('iframe');
    iframe2.setAttribute('src', 'localhost');
    container.appendChild(iframe2);
    expect(
      getIframesForStore({
        document: container,
        location: { hostname: 'localhost' },
      })
    ).toStrictEqual({ 'wikipedia.org': { parsing: false, top: 0 } });
  });

  test('invalid inputs', () => {
    const emptyContainer = document.createElement('div');
    expect(
      getIframesForStore({
        document: emptyContainer,
        location: { hostname: 'localhost' },
      })
    ).toStrictEqual({});
  });
});

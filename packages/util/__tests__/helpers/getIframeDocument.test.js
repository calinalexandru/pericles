/**
 * @jest-environment jsdom
 */

import { test, expect, describe } from '@jest/globals';
import getIframeDocument from '../../src/helpers/getIframeDocument';

describe('getIframeDocument', () => {
  test('checks for contentDocument first', () => {
    const iframe = {
      contentDocument: 'cd',
      contentWindow: { document: 'cwd' },
    };
    expect(getIframeDocument(iframe)).toBe('cd');
  });

  test('checks for contentWindow->document second', () => {
    const iframe = {
      contentWindow: { document: 'cwd' },
    };
    expect(getIframeDocument(iframe)).toBe('cwd');
  });

  test('check for invalid inputs', () => {
    expect(getIframeDocument(null)).toBe(undefined);
    expect(getIframeDocument(undefined)).toBe(undefined);
    expect(getIframeDocument(10)).toBe(undefined);
    expect(getIframeDocument(-10)).toBe(undefined);
    expect(getIframeDocument(new Map())).toBe(undefined);
    expect(getIframeDocument(Infinity)).toBe(undefined);
  });
});

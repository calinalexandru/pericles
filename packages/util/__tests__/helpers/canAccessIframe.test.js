/**
 * @jest-environment jsdom
 */

import { test, expect, describe } from '@jest/globals';
import canAccessIframe from '../../src/helpers/canAccessIframe';

describe('canAccessIframe', () => {
  test('contentDocument first', () => {
    const iframe = {
      contentDocument: 'cd',
      contentWindow: { document: 'cwd' },
    };
    expect(canAccessIframe(iframe)).toBe('cd');
  });

  test('contentWindow->document second', () => {
    const iframe = {
      contentWindow: { document: 'cwd' },
    };
    expect(canAccessIframe(iframe)).toBe('cwd');
  });

  test('invalid inputs', () => {
    expect(canAccessIframe(null)).toBe(false);
    expect(canAccessIframe(undefined)).toBe(false);
    expect(canAccessIframe(10)).toBe(false);
    expect(canAccessIframe(-10)).toBe(false);
    expect(canAccessIframe(new Map())).toBe(false);
    expect(canAccessIframe(Infinity)).toBe(false);
  });
});

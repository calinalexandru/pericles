/**
 * @jest-environment jsdom
 */

import { test, expect, describe } from '@jest/globals';
import findAvailableIframe from '../../src/helpers/findAvailableIframe';

describe('findAvailableIframe', () => {
  test('correct order is applied', () => {
    expect(
      findAvailableIframe({
        'ilie.com': { parsing: false },
        'clients2.com': { parsing: false },
        'clients1.com': { parsing: false },
      })
    ).toBe('ilie.com');
    expect(
      findAvailableIframe({
        'ilie.com': { parsing: true },
        'clients2.com': { parsing: false },
        'clients1.com': { parsing: true },
      })
    ).toBe('clients2.com');
    expect(
      findAvailableIframe({
        'ilie.com': { parsing: true },
        'clients2.com': { parsing: true },
        'clients1.com': { parsing: false },
      })
    ).toBe('clients1.com');
    expect(
      findAvailableIframe({
        'ilie.com': { parsing: true },
        'clients2.com': { parsing: true },
        'clients1.com': { parsing: true },
      })
    ).toBe(false);
  });
  test('no more iframes', () => {
    expect(
      findAvailableIframe({
        'ilie.com': { parsing: true },
        'clients2.com': { parsing: true },
        'clients1.com': { parsing: true },
      })
    ).toBe(false);
  });

  test('invalid inputs', () => {
    expect(findAvailableIframe(null)).toBe(false);
    expect(findAvailableIframe(undefined)).toBe(false);
    expect(findAvailableIframe(10)).toBe(false);
    expect(findAvailableIframe(-10)).toBe(false);
    expect(findAvailableIframe(new Map())).toBe(false);
    expect(findAvailableIframe(Infinity)).toBe(false);
  });
});

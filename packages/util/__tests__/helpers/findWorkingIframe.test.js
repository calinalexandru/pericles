/**
 * @jest-environment jsdom
 */

import { test, expect, describe } from '@jest/globals';
import findWorkingIframe from '../../src/helpers/findWorkingIframe';

describe('findWorkingIframe', () => {
  test('correct order is applied', () => {
    expect(
      findWorkingIframe({
        'ilie.com': { parsing: true },
        'clients2.com': { parsing: false },
        'clients1.com': { parsing: false },
      })
    ).toBe('ilie.com');
    expect(
      findWorkingIframe({
        'ilie.com': { parsing: false },
        'clients2.com': { parsing: true },
        'clients1.com': { parsing: true },
      })
    ).toBe('clients2.com');
    expect(
      findWorkingIframe({
        'ilie.com': { parsing: false },
        'clients2.com': { parsing: false },
        'clients1.com': { parsing: true },
      })
    ).toBe('clients1.com');
    expect(
      findWorkingIframe({
        'ilie.com': { parsing: false },
        'clients2.com': { parsing: false },
        'clients1.com': { parsing: false },
      })
    ).toBe(false);
  });

  test('invalid inputs', () => {
    expect(findWorkingIframe(null)).toBe(false);
    expect(findWorkingIframe(undefined)).toBe(false);
    expect(findWorkingIframe(10)).toBe(false);
    expect(findWorkingIframe(-10)).toBe(false);
    expect(findWorkingIframe(new Map())).toBe(false);
    expect(findWorkingIframe(Infinity)).toBe(false);
  });
});

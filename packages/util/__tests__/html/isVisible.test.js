/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import isVisible from '../../src/html/isVisible';
// const { window } = new JSDOM(`
// <!DOCTYPE html>
// <html>
// <head>
//   <title>hello</title>
// </head>
//   <body>
//     <p>Hello world</p>
//   </body>
// </html>
// `);
const para = document.createElement('p');

describe('isVisible', () => {
  test('is visible', () => {
    expect(isVisible({ window, el: para })).toBe(true);
  });
});

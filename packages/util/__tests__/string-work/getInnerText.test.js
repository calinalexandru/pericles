/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals';
import getInnerText from '../../src/string-work/getInnerText';

describe('getInnerText', () => {
  test('trim', () => {
    expect(getInnerText(` hello `)).toBe('hello');
    expect(getInnerText(` hello`)).toBe('hello');
    expect(getInnerText(` hello    `)).toBe('hello');
  });

  test('clear new lines', () => {
    expect(getInnerText(`\n\r\n`)).toBe('');
    expect(getInnerText(`\n\r`)).toBe('');
    expect(getInnerText(`\n`)).toBe('');
    expect(getInnerText(`\r\n`)).toBe('');
    expect(getInnerText(`\r \n`)).toBe('');
    expect(getInnerText(`\n \r`)).toBe('');
    expect(getInnerText(`\n <span> \r</span>`)).toBe('');
  });

  test('remove valid html tags', () => {
    expect(getInnerText(`<span>some text</span>`)).toBe('some text');
    expect(getInnerText(`<span>some <span>whatever</span>here</span>`)).toBe(
      'some whateverhere'
    );
    expect(
      getInnerText(`<div><span>some <span>whatever</span> there</span>`)
    ).toBe('some whatever there');
  });

  test('removes invalid html tags', () => {
    expect(
      getInnerText(`<div><span>some[1] <span>whatever</span> ok</span>`)
    ).toBe('some whatever ok');
    expect(
      getInnerText(`<span>some <span>whatever</span> ok</span></div>`)
    ).toBe('some whatever ok');
    expect(
      getInnerText(
        `<div style="cursor: pointer;"><span>some <span>whatever</span> pointer</span></div>`
      )
    ).toBe('some whatever pointer');
  });

  test('remove annotations like [1], [2]', () => {
    expect(getInnerText(`hello world[1]`)).toBe('hello world');
    expect(getInnerText(`hello w[1]orld`)).toBe('hello world');
    expect(getInnerText(`[2]hello w[1]orld`)).toBe('hello world');
    expect(getInnerText(`[2]hello w[1]orld[3]`)).toBe('hello world');
    expect(getInnerText(`2]hello <span></span>w[1]orld[3`)).toBe(
      '2]hello world[3'
    );
    expect(
      getInnerText(`2]hello \n\r<span style="bg: red;"></span>\nw[1]orld[3\r`)
    ).toBe('2]hello world[3');
    expect(getInnerText(`2]hello w[1]orld[3`)).toBe('2]hello world[3');
    expect(getInnerText(`[[2]hello w[1]orld[3]]`)).toBe('[hello world]');
    // expect(getInnerText(`[[2]]hello w[-10]orld[[3]]`)).toBe(
    //   '[]hello w[-10]orld[]'
    // );
  });

  // test('remove outer brackets', () => {
  //   expect(getInnerText(`(hello world)`)).toBe('hello world');
  //   expect(getInnerText(`hello super (world)`)).toBe('hello super (world)');
  // });

  test('invalid inputs', () => {
    expect(getInnerText('')).toBe('');
  });
});

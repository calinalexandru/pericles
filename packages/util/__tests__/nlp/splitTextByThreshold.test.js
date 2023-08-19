/*
 * @jest-environment jsdom
 */
import { describe, expect, test } from '@jest/globals';
import splitTextByThreshold from '../../src/nlp/splitTextByThreshold';

describe('splitTextByThreshold', () => {
  test('returns array if not array', () => {
    expect(splitTextByThreshold(false)).toStrictEqual([]);
  });

  test('sentences under threshold remain unchainged', () => {
    const initialArr = [
      'Small sentence one',
      'Another senntence under 50 chars',
      'Ol mcdonalds had a farm, or something',
    ];

    expect(splitTextByThreshold(initialArr)).toStrictEqual(initialArr);
  });

  test('it splits the sentences', () => {
    const initialArr = [
      `Prior to their successful Major campaign and ever since bringing on Robin "⁠ropz⁠" Kool, Finn "⁠karrigan⁠" Andersen and his men have put up remarkable results by taking home both IEM Katowice and ESL Pro League Season 15, two events included in the coveted Intel Grand Slam circuit.`,
      `For ENCE, who have been red-hot this year with an ESL Pro League Season 15 grand final appearance and a semi-final run at the Major, losing their best player (statistically speaking), who currently leads the rest of his squad with a 1.18 rating in 2022, will be quite a challenge.`,
    ];

    expect(splitTextByThreshold(initialArr)).toStrictEqual([
      `Prior to their successful Major campaign and ever since bringing on Robin "⁠ropz⁠" Kool, Finn "⁠karrigan⁠" Andersen and his men have put up remarkable results by taking home both IEM Katowice and ESL Pro League Season 15, two events included in the coveted Intel Grand`,
      'Slam circuit.',
      `For ENCE, who have been red-hot this year with an ESL Pro League Season 15 grand final appearance and a semi-final run at the Major, losing their best player (statistically speaking), who currently leads the rest of his squad with a 1.18 rating in 2022, will be quite a`,
      'challenge.',
    ]);
  });
});

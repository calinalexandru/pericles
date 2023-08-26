import { pipe, } from 'ramda';

import removeHTMLSpaces from './removeHTMLSpaces';
import removeZeroWidthNonJoiner from './removeZeroWidthNonJoiner';
import replaceLineBreaks from './replaceLineBreaks';
import trimQuotes from './trimQuotes';

export default function cleanHtmlText(text: string): string {
  return pipe(
    removeZeroWidthNonJoiner,
    replaceLineBreaks,
    removeHTMLSpaces,
    trimQuotes
  )(text);
}

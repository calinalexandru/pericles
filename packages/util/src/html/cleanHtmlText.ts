import removeHTMLSpaces from './removeHTMLSpaces';
import removeZeroWidthNonJoiner from './removeZeroWidthNonJoiner';
import replaceLineBreaks from './replaceLineBreaks';
import trimQuotes from './trimQuotes';

export default function cleanHtmlText(text: string): string {
  return trimQuotes(
    removeHTMLSpaces(replaceLineBreaks(removeZeroWidthNonJoiner(text)))
  );
}

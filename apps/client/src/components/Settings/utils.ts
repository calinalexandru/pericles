import { matchSorter, MatchSorterOptions, } from 'match-sorter';

import { VoiceType, } from '@pericles/constants';

interface FilterProps {
  inputValue: string;
}

const filterFunc = (
  options: VoiceType[],
  { inputValue, }: FilterProps
): VoiceType[] => {
  if (!inputValue.length) return options;
  const limit = 50;

  const rankingOptions: MatchSorterOptions<VoiceType> = {
    keys: [
      {
        threshold: matchSorter.rankings.CONTAINS,
        key: 'shortTitle',
      },
      {
        threshold: matchSorter.rankings.CONTAINS,
        key: 'nativeName',
      },
      {
        threshold: matchSorter.rankings.CONTAINS,
        key: 'tags',
      },
      {
        threshold: matchSorter.rankings.ACRONYM,
        key: 'countryCode',
      },
    ],
  };

  const limitTen = matchSorter(options, inputValue, rankingOptions);

  return limitTen.length >= limit ? limitTen.slice(0, limit) : limitTen;
};

export default filterFunc;

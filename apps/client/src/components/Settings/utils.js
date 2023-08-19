import { matchSorter, } from 'match-sorter';

export default (options, { inputValue, }) => {
  // console.log('filterFunc.opts', options);
  if (!inputValue.length) return options;
  const limit = 50;
  const limitTen = matchSorter(
    // options.map((opt) => ({ ...opt, fullText: getJointWords(opt) })),
    options,
    inputValue,
    {
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
    }
  );
  // console.log({ inputValue });
  return limitTen.length >= limit ? limitTen.slice(0, limit) : limitTen;
};

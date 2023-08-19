// !Could this regex work? found here:  https://www.tutorialspoint.com/how-to-split-sentence-into-blocks-of-fixed-length-without-breaking-words-in-javascript
//  const regex = new RegExp(String.raw`\S.{1,${size &minu; 2}}\S(?= |$)`, 'g');

const space = ' ';
const lengthComparator = (textLength, threshold) => textLength >= threshold;

export default function splitTextByThreshold(arr, threshold = 270) {
  if (!Array.isArray(arr)) return [];

  const newArray = [];

  arr.forEach((text) => {
    if (lengthComparator(text.length, threshold)) {
      newArray.push(
        ...text
          .split(space)
          .reduce(
            (acc, curr) => {
              // Get the number of nested arrays
              const currIndex = acc.length - 1;

              // Join up the last array and get its length
              const currLen = acc[currIndex]?.join?.(' ')?.length;

              // If the length of that content and the new word
              // in the iteration exceeds 20 chars push the new
              // word to a new array
              if (lengthComparator(currLen + curr.length, threshold)) {
                acc.push([ curr, ]);

                // otherwise add it to the existing array
              } else {
                acc[currIndex].push(curr);
              }

              return acc;
            },
            [ [], ]
          )
          .map((tokenArr) => tokenArr.join(space))
      );
    } else {
      newArray.push(text);
    }
  });

  return newArray;
}

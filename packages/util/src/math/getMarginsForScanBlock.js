/* eslint-disable no-bitwise */
export default function getMarginsForScanBlock({ size, offset, start = 1, }) {
  const x = ~~(size / 2);
  const slice = ~~(size / 8);
  const block = ~~(size / 16);
  const margins = [];
  let y;
  for (let i = start; i <= size; i += block) {
    y = i - offset;
    margins.push({ x, y, });
    margins.push({ x: x - slice, y, });
    margins.push({ x: x + slice, y, });
  }
  return margins;
}

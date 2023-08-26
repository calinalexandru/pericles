export default function compareValuesWithMargin(
  num1: number,
  num2: number,
  margin: number
): boolean {
  return Math.abs(num1 - num2) >= margin;
}

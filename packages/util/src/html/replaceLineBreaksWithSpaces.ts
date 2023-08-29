export default function replaceLineBreaksWithSpaces(str: string): string {
  return str.replace(/\n|\t/g, ' ');
}

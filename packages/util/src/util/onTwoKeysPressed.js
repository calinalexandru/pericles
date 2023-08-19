export default function onTwoKeysPressed(keys) {
  return keys.filter((key) => key !== false).length > 1;
}

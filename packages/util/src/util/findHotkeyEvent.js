export default function findHotkeyEvent(hotkeys, keys, e) {
  return Object.keys(hotkeys).find((key) => {
    const thisKey = hotkeys[key];
    if (thisKey.length !== 1) {
      if (keys[thisKey[0].key] && keys[thisKey[1].key]) {
        return true;
      }
    } else {
      return thisKey[0].key === e.key || thisKey[0].which === e.keyCode;
    }
    return false;
  });
}

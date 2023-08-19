import { useDispatch, } from 'react-redux';

import { hotkeysActions, } from '@pericles/store';

const { hotkeys, } = hotkeysActions;
export default function useHotkeysSettings() {
  const dispatch = useDispatch();
  const setHotkeysSetting = (key, val) => dispatch(hotkeys.set({ [key]: val, }));
  const onHotkeyFocus = (hotkey) => dispatch(hotkeys.set({ focus: hotkey, }));

  return {
    setHotkeysSetting,
    onHotkeyFocus,
  };
}

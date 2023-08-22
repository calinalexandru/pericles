import { useDispatch, } from 'react-redux';

import { setHotkeys, } from '@pericles/store';

export default function useHotkeysSettings() {
  const dispatch = useDispatch();
  const setHotkeysSetting = (key, val) => dispatch(setHotkeys({ [key]: val, }));
  const onHotkeyFocus = (hotkey) => dispatch(setHotkeys({ focus: hotkey, }));

  return {
    setHotkeysSetting,
    onHotkeyFocus,
  };
}

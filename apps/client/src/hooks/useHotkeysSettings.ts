import { useDispatch, } from 'react-redux';

import { Hotkey, } from '@pericles/constants';
import { setHotkeys, } from '@pericles/store';

export default function useHotkeysSettings() {
  const dispatch = useDispatch();
  const setHotkeysSetting = (key: string, val: Hotkey[] | boolean) =>
    dispatch(setHotkeys({ [key]: val, }));

  return {
    setHotkeysSetting,
  };
}

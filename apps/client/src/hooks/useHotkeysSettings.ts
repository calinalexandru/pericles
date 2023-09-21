import { useDispatch, } from 'react-redux';

import { Hotkey, } from '@pericles/constants';
import { hotkeysActions, } from '@pericles/store';

export default function useHotkeysSettings() {
  const dispatch = useDispatch();
  const setHotkeysSetting = (key: string, val: Hotkey[] | boolean) =>
    dispatch(hotkeysActions.set({ [key]: val, }));

  return {
    setHotkeysSetting,
  };
}

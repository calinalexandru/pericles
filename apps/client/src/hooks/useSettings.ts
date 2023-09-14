import { useCallback, } from 'react';
import { useDispatch, } from 'react-redux';

import { VARIABLES, } from '@pericles/constants';
import { setSettings, } from '@pericles/store';

interface UseSettingsHook {
  setSetting: (key: string, val: number | string | boolean) => void;
  setVisible: (val: boolean) => void;
}

export default function useSettings(): UseSettingsHook {
  const dispatch = useDispatch();

  const setSetting = useCallback(
    (key: string, val: number | string | boolean) =>
      dispatch(setSettings({ [key]: val, })),
    [ dispatch, ]
  );

  const setVisible = useCallback(
    (val: boolean) =>
      dispatch(setSettings({ [VARIABLES.SETTINGS.VISIBLE]: val, })),
    [ dispatch, ]
  );

  return {
    setSetting,
    setVisible,
  };
}

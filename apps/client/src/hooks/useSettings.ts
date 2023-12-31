import { useCallback, } from 'react';
import { useDispatch, } from 'react-redux';

import { VARIABLES, } from '@pericles/constants';
import { settingsActions, } from '@pericles/store';

interface UseSettingsHook {
  setSetting: (key: string, val: number | string | boolean) => void;
  setVisible: (val: boolean) => void;
}

export default function useSettings(): UseSettingsHook {
  const dispatch = useDispatch();

  const setSetting = useCallback(
    (key: string, val: number | string | boolean) => {
      console.log('settings.set', key, val);
      dispatch(settingsActions.set({ [key]: val, }));
    },
    [ dispatch, ]
  );

  const setVisible = useCallback(
    (val: boolean) =>
      dispatch(settingsActions.set({ [VARIABLES.SETTINGS.VISIBLE]: val, })),
    [ dispatch, ]
  );

  return {
    setSetting,
    setVisible,
  };
}

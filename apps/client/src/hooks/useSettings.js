import { useCallback, } from 'react';
import { useDispatch, } from 'react-redux';

import { VARIABLES, } from '@pericles/constants';
import { setSettings, } from '@pericles/store';

export default function useSettings() {
  const dispatch = useDispatch();
  const setSetting = useCallback(
    (key, val) => dispatch(setSettings({ [key]: val, })),
    [ dispatch, ]
  );
  const setVisible = useCallback(
    (val) => dispatch(setSettings({ [VARIABLES.SETTINGS.VISIBLE]: val, })),
    [ dispatch, ]
  );

  return {
    setSetting,
    setVisible,
  };
}

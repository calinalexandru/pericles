import { useCallback, } from 'react';
import { useDispatch, } from 'react-redux';

import { VARIABLES, } from '@pericles/constants';
import { settingsActions, } from '@pericles/store';

const { settings, } = settingsActions;
export default function useSettings() {
  const dispatch = useDispatch();
  // const voice = useSelector(settingsVoiceSelector);
  // const volume = useSelector(settingsVolumeSelector);
  // const rate = useSelector(settingsRateSelector);
  // const pitch = useSelector(settingsPitchSelector);
  // const visible = useSelector(settingsVisibleSelector);
  // const voices = useSelector(settingsVoicesSelector);
  // const neuralVoices = useSelector(settingsNeuralVoicesSelector);
  const setSetting = useCallback(
    (key, val) => dispatch(settings.set({ [key]: val, })),
    []
  );
  const setVisible = useCallback(
    (val) => dispatch(settings.set({ [VARIABLES.SETTINGS.VISIBLE]: val, })),
    []
  );

  return {
    setSetting,
    setVisible,
  };
}

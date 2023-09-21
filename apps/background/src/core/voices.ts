import { store, appActions, settingsActions, } from '@pericles/store';
import { getBrowserAPIVoices, } from '@pericles/util';

export default () => {
  // hook for system voices
  getBrowserAPIVoices()
    .then((voices) => {
      store.dispatch(settingsActions.set({ voices, }));
    })
    .catch((e) => console.log(e));

  // hook for azure neural voices
  store.dispatch(appActions.init());
};

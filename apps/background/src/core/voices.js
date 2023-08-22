import { store, setSettings, appInit, } from '@pericles/store';
import { getBrowserAPIVoices, } from '@pericles/util';

export default async () => {
  // hook for system voices
  getBrowserAPIVoices()
    .then((voices) => {
      store.dispatch(setSettings({ voices, }));
    })
    .catch((e) => console.log(e));

  // hook for azure neural voices
  store.dispatch(appInit());
};

import { store, appActions, setSettings, } from '@pericles/store';
import { getBrowserAPIVoices, } from '@pericles/util';

const { app, } = appActions;
export default async () => {
  // hook for system voices
  getBrowserAPIVoices()
    .then((voices) => {
      store.dispatch(setSettings({ voices, }));
    })
    .catch((e) => console.log(e));

  // hook for azure neural voices
  store.dispatch(app.init());
};

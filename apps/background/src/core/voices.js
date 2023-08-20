import { store, appActions, settingsActions, } from '@pericles/store';
import { getBrowserAPIVoices, } from '@pericles/util';

const { settings, } = settingsActions;
const { app, } = appActions;
export default async () => {
  // hook for system voices
  getBrowserAPIVoices()
    .then((voices) => {
      store.dispatch(settings.set({ voices, }));
    })
    .catch((e) => console.log(e));

  // hook for azure neural voices
  store.dispatch(app.init());
};

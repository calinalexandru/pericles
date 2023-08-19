import store from '@/store';
import { appActions, settingsActions, } from '@pericles/store';
import { getBrowserAPIVoices, } from '@pericles/util';

const { settings, } = settingsActions;
const { app, } = appActions;
export default async () => {
  // hook for system voices
  getBrowserAPIVoices()
    .then(async (voices) => {
      await store.current.dispatch(settings.set({ voices, }));
    })
    .catch((e) => console.log(e));
  speechSynthesis.onvoiceschanged = () => {
    // console.log('the voice has changed');
    getBrowserAPIVoices()
      .then(async (voices) => {
        await store.current.dispatch(settings.set({ voices, }));
      })
      .catch((e) => console.log(e));
  };

  // hook for azure neural voices
  await store.current.dispatch(app.init());
};

import store from '@/store';
import { LOCAL_STORAGE_SETTINGS, VARIABLES, } from '@pericles/constants';
import { appActions, hotkeysActions, settingsActions, } from '@pericles/store';
import { LocalStorage, } from '@pericles/util';

const { settings, } = settingsActions;
const { app, } = appActions;
const { hotkeys, } = hotkeysActions;

export default async () => {
  // TODO:refactor
  // try to set best avail voice in case storage is empty
  const storedVoice = await LocalStorage.getAsync(VARIABLES.SETTINGS.VOICE);
  if (storedVoice.voice === null) {
    await store.current.dispatch(settings.setFreeVoice());
  }

  LocalStorage.getItemsFromStorage(
    LOCAL_STORAGE_SETTINGS.SETTINGS.ITEMS
  ).subscribe(async (payload) => {
    console.log('LocalStorage.settingsArr', payload);
    await store.current.dispatch(settings.set(payload));
  });

  LocalStorage.getItemsFromStorage(LOCAL_STORAGE_SETTINGS.APP.ITEMS).subscribe(
    async (payload) => {
      console.log('LocalStorage.appSettingsArr', payload);
      await store.current.dispatch(app.set(payload));
    }
  );

  LocalStorage.getItemsFromStorage(
    LOCAL_STORAGE_SETTINGS.HOTKEYS.ITEMS
  ).subscribe(async (payload) => {
    console.log('LocalStorage.hotkeysSettingsArr', payload);
    await store.current.dispatch(hotkeys.set(payload));
  });
};

import { LOCAL_STORAGE_SETTINGS, VARIABLES, } from '@pericles/constants';
import {
  store,
  appActions,
  hotkeysActions,
  setFreeVoice,
  setSettings,
} from '@pericles/store';
import { LocalStorage, } from '@pericles/util';

const { app, } = appActions;
const { hotkeys, } = hotkeysActions;

export default async () => {
  // TODO:refactor
  // try to set best avail voice in case storage is empty
  const storedVoice = await LocalStorage.getAsync(VARIABLES.SETTINGS.VOICE);
  if (storedVoice.voice === null) {
    store.dispatch(setFreeVoice());
  }

  LocalStorage.getItemsFromStorage(
    LOCAL_STORAGE_SETTINGS.SETTINGS.ITEMS
  ).subscribe(async (payload) => {
    console.log('LocalStorage.settingsArr', payload);
    store.dispatch(setSettings(payload));
  });

  LocalStorage.getItemsFromStorage(LOCAL_STORAGE_SETTINGS.APP.ITEMS).subscribe(
    (payload) => {
      console.log('LocalStorage.appSettingsArr', payload);
      store.dispatch(app.set(payload));
    }
  );

  LocalStorage.getItemsFromStorage(
    LOCAL_STORAGE_SETTINGS.HOTKEYS.ITEMS
  ).subscribe(async (payload) => {
    console.log('LocalStorage.hotkeysSettingsArr', payload);
    store.dispatch(hotkeys.set(payload));
  });
};

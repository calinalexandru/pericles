import getBrowserAPI from './getBrowserAPI';

export default function getStorageAPI() {
  const { api: core, } = getBrowserAPI();
  let api;
  try {
    api = core.storage.local;
  } catch (e) {
    throw new Error('Storage API is not present', e);
  }

  return api;
}

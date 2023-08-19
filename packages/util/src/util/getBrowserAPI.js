export default function getBrowserAPI() {
  let api;
  let isFirefox = true;
  /*eslint-disable */
  try {
    api = browser;
  } catch (error) {
    api = global.chrome;
    isFirefox = false;
  }
  /* eslint-enable */

  if (!api) {
    throw new Error('Browser API is not present');
  }

  return { api, isFirefox, };
}

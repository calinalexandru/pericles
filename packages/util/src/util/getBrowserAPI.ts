export type BrowserApiType = typeof chrome;

export type GetBrowserApiType = {
  api: BrowserApiType;
  isFirefox: boolean;
};

export function getBrowserAPI(): GetBrowserApiType {
  const api: BrowserApiType = chrome;

  if (!api) {
    throw new Error('Browser API is not present');
  }

  console.log('getBrowserAPI', api);

  return { api, isFirefox: false, };
}

import getBrowserAPI from './util/getBrowserAPI';

const { api: core, isFirefox, } = getBrowserAPI();

interface Tab {
  id: number;
  active: boolean;
  [key: string]: any;
}

interface PayloadAction {
  type: string;
  payload?: any;
}

interface MessagePayload {
  message: PayloadAction;
  activeTab: Tab;
}

function sendMessageToTab(tab: Tab, message: PayloadAction): Promise<any> {
  // console.log('sendMessageToTab - ', tab);
  const messagePayload: MessagePayload = { message, activeTab: tab, };
  console.log('messagePayload', messagePayload);

  if (isFirefox) {
    return core.tabs
      .sendMessage(tab.id, messagePayload)
      .then((response: any) => {
        console.log('Sent Message Response', response);
        return response;
      })
      .catch((error) =>
        Promise.reject(
          new Error(JSON.stringify({ message: error, response: false, }))
        )
      );
  }

  return new Promise((resolve, reject) => {
    core.tabs.sendMessage(tab.id, messagePayload, (response) => {
      if (core.runtime.lastError) {
        reject(
          new Error(
            JSON.stringify({
              message: core.runtime.lastError.message,
              response: false,
            })
          )
        );
      } else {
        console.log('Sent Message Response', response);
        resolve(response);
      }
    });
  });
}

function internal(m: PayloadAction, id: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const queryTabs = (callback: (tabs: Tab[]) => void) => {
      if (isFirefox) {
        core.tabs
          .query({})
          .then(callback)
          .catch((error) =>
            reject(
              new Error(JSON.stringify({ message: error, response: false, }))
            )
          );
      } else {
        core.tabs.query({}, callback);
      }
    };

    queryTabs((tabs) => {
      const activeTab = tabs.find((tab) =>
        id > 0 ? tab.id === id : tab.active
      );
      if (activeTab && activeTab.id) {
        sendMessageToTab(activeTab, m).then(resolve).catch(reject);
      } else {
        reject(
          new Error(
            JSON.stringify({ message: 'no active tab', response: false, })
          )
        );
      }
    });
  });
}

export default function mpToContent(
  message: PayloadAction | PayloadAction[],
  id = 0
): void {
  const messages = Array.isArray(message) ? message : [ message, ];
  const promises = messages.map((m: PayloadAction) => internal(m, id));
  Promise.all(promises).catch(console.error);
}

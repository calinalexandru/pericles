import getBrowserAPI from './util/getBrowserAPI';

const internal = (m, id) =>
  new Promise((resolve, reject) => {
    console.log('mpToContent', m, id);
    const { api: core, isFirefox, } = getBrowserAPI();

    const callback = (tabs) => {
      const newTabs = tabs.filter((tab) =>
        id > 0 ? tab.id === id : tab.active === true
      );
      const activeTab = newTabs[0];
      if (activeTab && activeTab.id) {
        const messagePayload = { message: m, activeTab, };
        if (isFirefox) {
          core.tabs
            .sendMessage(activeTab.id, messagePayload)
            .then((response) => {
              console.log('whatever', response);
              resolve(response);
            })
            .catch((e) => {
              reject({ error: e, response: false, });
            });
        } else {
          core.tabs.sendMessage(activeTab.id, messagePayload, (response) => {
            console.log('whatever', response);
            resolve(response);
          });
        }
        console.log('mpToContent -> sendMessage', activeTab, messagePayload);
      } else {
        reject({ error: 'no active tab', response: false, });
      }
    };

    if (isFirefox) {
      core.tabs.query({}).then(callback, (e) => {
        reject({ error: e, response: false, });
      });
    } else {
      core.tabs.query({}, callback);
    }
  });

export default function mpToContent(message, id = 0) {
  console.log('internal', { message, id, });
  const promises = [];
  if (Array.isArray(message))
    message.forEach((m) => promises.push(internal(m, id)));
  else promises.push(internal(message, id));
  Promise.all(promises);
}

export default function mutationCheck(targetNode, timeout) {
  console.log('mutationCheck.starting', { targetNode, timeout, });
  let t;
  let observer;
  return new Promise((resolve, reject) => {
    const config = { childList: true, subtree: true, };
    if (!targetNode) resolve(false);

    const work = () => {
      resolve(true);
      observer.disconnect();
      console.log('mutationCheck.finished');
    };
    const callback = (mutationList) => {
      mutationList.forEach(() => {
        clearTimeout(t);
        t = setTimeout(work, timeout);
      });
    };
    try {
      observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    } catch (e) {
      clearTimeout(t);
      reject();
    }
    t = setTimeout(work, timeout);
  });
}

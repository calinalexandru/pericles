export default function mutationCheck(
  targetNode: HTMLElement | Window,
  timeout: number
): Promise<boolean> {
  console.log('mutationCheck.starting', { targetNode, timeout, });

  let t: number;
  let observer: MutationObserver | undefined;

  return new Promise((resolve, reject) => {
    const config: MutationObserverInit = { childList: true, subtree: true, };

    if (!targetNode) resolve(false);

    const work = () => {
      resolve(true);
      if (observer) {
        observer.disconnect();
      }
      console.log('mutationCheck.finished');
    };

    const callback = (mutationList: MutationRecord[]) => {
      mutationList.forEach(() => {
        clearTimeout(t);
        t = setTimeout(work, timeout);
      });
    };

    try {
      observer = new MutationObserver(callback);
      observer.observe(targetNode as Node, config);
    } catch (e) {
      clearTimeout(t);
      reject(e);
    }

    t = setTimeout(work, timeout);
  });
}

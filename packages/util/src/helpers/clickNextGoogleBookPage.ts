export default async function clickNextGoogleBookPage(): Promise<
  boolean | Error
  > {
  let t: any;
  return new Promise((resolve, reject) => {
    try {
      const nextButton = document.querySelector<HTMLElement>(
        'button[aria-label="Next Page"]'
      );
      if (nextButton) {
        nextButton.click();
      }
      t = setTimeout(() => {
        resolve(true);
      }, 500);
    } catch (e) {
      clearTimeout(t);
      reject(e);
    }
  });
}

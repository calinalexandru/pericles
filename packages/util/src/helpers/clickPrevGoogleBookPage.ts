export default async function clickPrevGoogleBookPage(): Promise<
  boolean | Error
  > {
  let t;
  return new Promise((resolve, reject) => {
    try {
      const nextButton: HTMLElement = document.querySelector(
        'button[aria-label="Previous Page"]'
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

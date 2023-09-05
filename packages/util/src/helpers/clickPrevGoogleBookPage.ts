export default async function clickPrevGoogleBookPage(): Promise<
  boolean | Error
  > {
  let t: any;
  return new Promise((resolve, reject) => {
    try {
      const nextButton: HTMLElement | null = document.querySelector(
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

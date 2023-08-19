export default async function clickPrevGoogleBookPage() {
  let t;
  return new Promise((resolve, reject) => {
    try {
      const nextButton = document.querySelector(
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

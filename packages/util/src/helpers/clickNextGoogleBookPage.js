export default async function clickNextGoogleBookPage() {
  let t;
  return new Promise((resolve, reject) => {
    try {
      const nextButton = document.querySelector(
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

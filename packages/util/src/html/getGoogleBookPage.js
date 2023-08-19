export default function getGoogleBookPage(window) {
  return Array.from(window.document.querySelectorAll('.-gb-loaded'))
    .filter((el) => el?.getBoundingClientRect?.()?.width > 0)?.[0]
    ?.getAttribute('id')
    ?.split('-')?.[1];
}

export default function getGoogleBookPage(window: Window): number {
  return Number(
    Array.from(window.document.querySelectorAll('.-gb-loaded'))
      .filter((el) => el?.getBoundingClientRect?.()?.width > 0)?.[0]
      ?.getAttribute('id')
      ?.split('-')?.[1]
  );
}

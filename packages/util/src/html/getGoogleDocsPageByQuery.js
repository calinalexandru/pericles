import getGoogleDocsEditor from '../google-docs/getGoogleDocsEditor';

export default function getGoogleDocsPageByQuery() {
  const editor = getGoogleDocsEditor();
  const page = Number(
    Array.from(
      document.querySelectorAll(
        '.kix-canvas-tile-content, .kix-canvas-tile-selection'
      )
    ).filter(
      (el) =>
        el?.getBoundingClientRect?.()?.top + editor.scrollTop >=
        editor.scrollTop
    )?.[0]?.style?.zIndex || 0
  );
  console.log('getGoogleDocsPageByQuery', page);
  return page;
}

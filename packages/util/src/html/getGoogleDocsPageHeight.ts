export default function getGoogleDocsPageHeight(): number {
  console.log('getGoogleDocsPageHeight');
  return (
    document
      .querySelector('.kix-canvas-tile-content.kix-canvas-tile-selection svg')
      ?.getBoundingClientRect?.()?.height || 1
  );
}

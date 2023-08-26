export default function scrollToGoogleDocsPage(page: any): void {
  const pageEl = Array.from(
    document.querySelectorAll(
      '.kix-canvas-tile-content.kix-canvas-tile-selection'
    )
  ).filter((el: HTMLElement) => Number(el.style.zIndex) === page)?.[0];
  if (!pageEl) return;
  const pageElTop = pageEl?.getBoundingClientRect?.()?.top;
  if (Number.isNaN(pageElTop)) return;
  const top = document.querySelector('.kix-appview-editor')?.scrollTop;
  if (Number.isNaN(top)) return;

  document.querySelector('.kix-appview-editor').scrollTop = top + pageElTop;
}

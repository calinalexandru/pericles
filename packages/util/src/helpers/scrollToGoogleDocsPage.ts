export default function scrollToGoogleDocsPage(page: number): void {
  console.log('scrollToGoogleDocsPage', page);
  const pageEl = Array.from(
    document.querySelectorAll<HTMLElement>(
      '.kix-canvas-tile-content.kix-canvas-tile-selection'
    )
  ).filter((el: HTMLElement) => Number(el.style.zIndex) === page)?.[0];
  if (!pageEl) return;
  const pageElTop = pageEl?.getBoundingClientRect?.()?.top;
  console.log('scrollToGoogleDocsPage.pageElTop', pageElTop);
  if (Number.isNaN(pageElTop)) return;

  const editorEl = document.querySelector('.kix-appview-editor');
  if (!editorEl) return;

  const top = editorEl.scrollTop || 0;
  console.log('scrollToGoogleDocsPage.top', top);
  if (Number.isNaN(top)) return;

  editorEl.scrollTop = top + pageElTop;
}

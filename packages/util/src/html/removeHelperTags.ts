export default function removeHelperTags(els: HTMLElement[] | Text[]): void {
  els.forEach((section) => {
    section?.parentNode?.insertBefore?.(
      document.createTextNode(section.textContent || ''),
      section
    );
    section.remove();
  });
}

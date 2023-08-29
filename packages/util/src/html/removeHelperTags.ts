export default function removeHelperTags(els: Element[]): void {
  els.forEach((section) => {
    section.parentNode.insertBefore(
      document.createTextNode(section.textContent),
      section
    );
    section.remove();
  });
}

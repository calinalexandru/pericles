export default function removeHelperTags(els) {
  els.forEach((section) => {
    section.parentNode.insertBefore(
      document.createTextNode(section.textContent),
      section
    );
    section.remove();
  });
}

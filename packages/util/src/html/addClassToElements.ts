export default function addClassToElements(
  nodeList: NodeList,
  cls: string
): void {
  Array.from(nodeList).forEach((el: HTMLElement) => {
    el.classList.add(cls);
  });
}

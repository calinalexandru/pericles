export default function addClassToElements(
  nodeList: HTMLElement[],
  cls: string
): void {
  nodeList.forEach((el: HTMLElement) => {
    el.classList.add(cls);
  });
}

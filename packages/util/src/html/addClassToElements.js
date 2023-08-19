// some change here cacat mazga pishat
export default function addClassToElements(nodeList, cls) {
  Array.from(nodeList).forEach((el) => {
    el.classList.add(cls);
  });
}

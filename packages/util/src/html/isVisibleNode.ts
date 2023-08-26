export default function isVisibleNode({
  window,
  node,
  fromCursorY = 0,
}: {
  window: Window;
  node: Node;
  fromCursorY: number;
}): boolean {
  if (!node) return false;
  const range = window.document.createRange();
  range.selectNodeContents(node);
  let { height = -1, y = -1, x = -1, } = {};
  const domRects = range.getClientRects();
  if (!domRects.length) return true;
  [ { y, x, }, ] = domRects;
  ({ y: height, } = domRects[domRects.length - 1]);
  if (height <= 0 || y <= 0 || x <= 0) return false;
  const { y: adjustY = 0, } =
    node?.ownerDocument?.defaultView?.frameElement?.getBoundingClientRect?.() ||
    {};
  const absY = window.scrollY + adjustY + y + height;
  const scroller = fromCursorY;
  // console.log(
  // `isVisibleNode node: ${node.textContent}; absY:${absY}; scroller: ${scroller}`
  // );
  return absY >= scroller;
}

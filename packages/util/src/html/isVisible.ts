export default function isVisible({
  window,
  el,
  inViewport = false,
  fromY = 0,
}: {
  window: Window;
  el: HTMLElement;
  inViewport: boolean;
  fromY: number;
}): boolean {
  console.log('isVisible?', el, inViewport, fromY);
  const boundingRect = el?.getBoundingClientRect?.();
  if (!boundingRect) return false;
  const { width, height, x, y, } = boundingRect;
  const { y: adjustY = 0, } =
    el?.ownerDocument?.defaultView?.frameElement?.getBoundingClientRect?.() ||
    {};
  const absY = window.scrollY + adjustY + y + height;
  const absX = window.scrollX + x + width;
  const scroller = fromY;
  // console.log(`isVisible el: ${el}; absY:${absY}; scroller: ${scroller}`);
  if (inViewport && absY < scroller) return false;
  // if (width * height === 0) return false;
  if (absX < 0 || absY < 0) return false;
  const style = window.getComputedStyle(el);
  if (style.opacity === '0') return false;
  if (style.display.indexOf('none') !== -1) return false;
  if (Number(style.textIndent.replace('px', '')) <= -9999) return false;

  console.log('isVisible', el, 'yes');

  return true;
}

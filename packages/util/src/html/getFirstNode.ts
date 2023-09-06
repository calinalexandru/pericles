export default function getFirstNode(): HTMLElement {
  return (document?.body?.children?.[0] ||
    document?.body?.childNodes?.[0]) as HTMLElement;
}

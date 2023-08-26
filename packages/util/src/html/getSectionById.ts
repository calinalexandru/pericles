import getSelfIframes from './getSelfIframes';
import sectionQuerySelector from './sectionQuerySelector';

export default function getSectionById(id: string): HTMLElement | null {
  const find = document.querySelector<HTMLElement>(sectionQuerySelector(id));
  if (find) return find;
  return getSelfIframes().reduce<HTMLElement | null>(
    (acc, iframe) =>
      acc ||
      iframe.document.querySelector<HTMLElement>(sectionQuerySelector(id)),
    null
  );
}

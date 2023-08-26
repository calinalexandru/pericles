import getSelfIframes from './getSelfIframes';
import sectionQuerySelector from './sectionQuerySelector';

export default function getSectionsById(id: string): HTMLElement[] {
  const find = Array.from(
    document.querySelectorAll<HTMLElement>(sectionQuerySelector(id))
  );
  if (find.length) return find;

  return getSelfIframes().reduce<HTMLElement[]>(
    (acc, iframe) => [
      ...acc,
      ...Array.from(
        iframe.document.querySelectorAll<HTMLElement>(sectionQuerySelector(id))
      ),
    ],
    []
  );
}

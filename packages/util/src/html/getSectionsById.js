import getSelfIframes from './getSelfIframes';
import sectionQuerySelector from './sectionQuerySelector';

export default function getSectionsById(id) {
  const find = Array.from(document.querySelectorAll(sectionQuerySelector(id)));
  if (find.length) return find;

  return getSelfIframes().reduce(
    (acc, iframe) => [
      ...acc,
      ...Array.from(iframe.document.querySelectorAll(sectionQuerySelector(id))),
    ],
    []
  );
}

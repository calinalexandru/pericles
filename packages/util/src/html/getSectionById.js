import getSelfIframes from './getSelfIframes';
import sectionQuerySelector from './sectionQuerySelector';

export default function getSectionById(id) {
  const find = document.querySelector(sectionQuerySelector(id));
  if (find) return find;
  return getSelfIframes().reduce(
    (acc, iframe) =>
      acc || iframe.document.querySelector(sectionQuerySelector(id)),
    null
  );
}

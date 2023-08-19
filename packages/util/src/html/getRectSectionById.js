import rectSectionQuerySelector from './rectSectionQuerySelector';

export default function getRectSectionsById(id) {
  return document.querySelector(rectSectionQuerySelector(id));
}

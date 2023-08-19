import getSelfIframes from './getSelfIframes';

export default function removeClassFromAll(cls) {
  Array.from(document.querySelectorAll(`.${cls}`)).forEach((el) => {
    el.classList.remove(cls);
  });

  getSelfIframes().forEach((iframe) => {
    Array.from(iframe.document.querySelectorAll(`.${cls}`)).forEach((el) => {
      el.classList.remove(cls);
    });
  });
}

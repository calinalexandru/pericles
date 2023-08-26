export default function getGoogleBookEditor(window: Window): HTMLElement {
  return window.document.querySelector(
    'reader-horizontal-view.ng-star-inserted'
  );
}

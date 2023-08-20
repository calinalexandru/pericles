try {
  importScripts('./background-vendors.js');
  importScripts('./background-bundle.js');
} catch (e) {
  console.warn('Could not import service workers', e);
}

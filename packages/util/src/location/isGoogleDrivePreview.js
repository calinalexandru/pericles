export default function isGoogleDrivePreview(window) {
  return (
    window.location.hostname === 'drive.google.com' ||
    window.document.querySelector(
      'div[style*="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x64.png"]'
    ).length
  );
}

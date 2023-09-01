export default function isGoogleDrivePreview(window: Window): boolean {
  return (
    window.location.hostname === 'drive.google.com' ||
    !!window.document.querySelector<HTMLElement>(
      'div[style*="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x64.png"]'
    )
  );
}

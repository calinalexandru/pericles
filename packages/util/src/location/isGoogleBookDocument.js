export default function isGoogleBookDocument(window) {
  return (
    [ 'books.googleusercontent.com', 'play.google.com', ].includes(
      window.location.hostname
    ) && window.location.pathname.indexOf('/books/') !== -1
  );
}

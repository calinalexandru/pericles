const extensionId = 'kohfgcgbkjodfcfkcackpagifgbcmimk';
/* eslint-disable-next-line */
const injectCode = `(function(){window['_docs_annotate_canvas_by_ext']="${extensionId}";window['_docs_force_html_by_ext']="${extensionId}";})();`;
const script = document.createElement('script');
script.textContent = injectCode;
(document.head || document.documentElement).appendChild(script);

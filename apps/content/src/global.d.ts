import { ATTRIBUTES, } from '@pericles/constants';

interface Window {
  _docs_force_html_by_ext: string;
  [ATTRIBUTES.WINDOW.IFRAME_BUFFER]?: Node | null;
  [ATTRIBUTES.WINDOW.NODE_BUFFER]?: Node | null;
  [ATTRIBUTES.WINDOW.SENTENCE_BUFFER]?: string;
}

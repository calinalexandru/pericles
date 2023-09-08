import { ATTRIBUTES, } from '@pericles/constants';

interface Window {
  [ATTRIBUTES.WINDOW.IFRAME_BUFFER]?: Node;
}

declare namespace chrome {
  namespace tabs {
    type Tab = any;
  }
}

import { ATTRIBUTES, } from '@pericles/constants';

interface CSSStyles {
  [key: string]: string | number;
}

const iframeCSS: CSSStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '50px',
  height: '26px',
  background: 'transparent',
  overflow: 'visible',
  marginTop: '-30px',
  transition: 'top 2s ease-in-out 0s',
  zIndex: 999999999999,
  border: 'none',
  padding: 0,
};

const iframeBodyCSS: CSSStyles = {
  margin: 0,
  padding: 0,
};

const miniPlayerCSS: CSSStyles = {
  width: '100%',
  height: '100%',
  background: 'transparent',
  overflow: 'visible',
};

export default function miniPlayerInject(): HTMLDivElement {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('id', ATTRIBUTES.ATTRS.CONTENT_IFRAME);

  for (const css in iframeCSS) {
    if (Object.hasOwn(iframeCSS, css)) {
      iframe.style[css as any] = iframeCSS[css] as string;
    }
  }

  document.body.appendChild(iframe);

  const miniPlayer = document.createElement('div');
  miniPlayer.setAttribute('id', ATTRIBUTES.ATTRS.MINI_PLAYER_CONTAINER);

  for (const css in miniPlayerCSS) {
    if (Object.hasOwn(miniPlayerCSS, css)) {
      miniPlayer.style[css as any] = miniPlayerCSS[css] as string;
    }
  }

  for (const css in iframeBodyCSS) {
    if (iframe.contentDocument && Object.hasOwn(iframeBodyCSS, css)) {
      iframe.contentDocument.body.style[css as any] = iframeBodyCSS[
        css
      ] as string;
    }
  }

  if (iframe.contentDocument) {
    iframe.contentDocument.body.appendChild(miniPlayer);
  }

  return miniPlayer;
}

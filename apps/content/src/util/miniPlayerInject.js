import { ATTRIBUTES, } from '@pericles/constants';

const iframeCSS = {
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

const iframeBodyCSS = {
  margin: 0,
  padding: 0,
};

const miniPlayerCSS = {
  width: '100%',
  height: '100%',
  background: 'transparent',
  overflow: 'visible',
};

export default function miniPlayerInject() {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('id', ATTRIBUTES.ATTRS.CONTENT_IFRAME);
  Object.keys(iframeCSS).forEach((css) => {
    iframe.style[css] = iframeCSS[css];
  });

  document.body.appendChild(iframe);
  const miniPlayer = document.createElement('div');
  miniPlayer.setAttribute('id', ATTRIBUTES.ATTRS.MINI_PLAYER_CONTAINER);
  Object.keys(miniPlayerCSS).forEach((css) => {
    miniPlayer.style[css] = miniPlayerCSS[css];
  });
  Object.keys(iframeBodyCSS).forEach((css) => {
    iframe.contentDocument.body.style[css] = iframeBodyCSS[css];
  });
  iframe.contentDocument.body.appendChild(miniPlayer);
  return miniPlayer;
}

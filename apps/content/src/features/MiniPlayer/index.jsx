import React, { useEffect, } from 'react';
import { useDispatch, useSelector, } from 'react-redux';

import NextSvg from '@/assets/next.svg';
import PauseSvg from '@/assets/pause.svg';
import PlaySvg from '@/assets/play.svg';
import SpinnerSvg from '@/assets/spinner.svg';
import { ATTRIBUTES, PLAYER_STATUS, } from '@pericles/constants';
import {
  appMiniPlayerSelector,
  parserTypeSelector,
  playerKeySelector,
  playerNext,
  playerPause,
  playerResume,
  playerSectionsSelector,
  playerStatusSelector,
} from '@pericles/store';
import {
  getRectSectionById,
  getSectionById,
  isGoogleDocsSvg,
} from '@pericles/util';

import { Container, Button, Icon, } from './styles';

export default function MiniPlayer() {
  const parserType = useSelector(parserTypeSelector);
  const enabled = useSelector(appMiniPlayerSelector);
  const status = useSelector(playerStatusSelector);
  const currentSection = useSelector(playerKeySelector);
  const sections = useSelector(playerSectionsSelector);
  console.log('MiniPlayer', { parserType, sections, status, });
  const dispatch = useDispatch();
  const onNext = () => {
    dispatch(playerNext());
  };
  const onPause = () => {
    dispatch(playerPause());
  };
  const onResume = () => {
    dispatch(playerResume());
  };
  const isPlaying = PLAYER_STATUS.PLAYING === status;
  const isLoading = [ PLAYER_STATUS.LOADING, PLAYER_STATUS.WAITING, ].includes(
    status
  );

  useEffect(() => {
    if (status === PLAYER_STATUS.STOPPED) {
      const iframe = document.getElementById(ATTRIBUTES.ATTRS.CONTENT_IFRAME);
      iframe.style.top = `-99px`;
      return;
    }
    if (currentSection === false) return;
    let section;
    if (isGoogleDocsSvg(parserType))
      section = getRectSectionById(currentSection);
    else section = getSectionById(currentSection);
    console.log('MiniPlayer.hook', section);

    if (!section) return;

    let adjustY = 0;
    let adjustX = 0;
    if (section?.ownerDocument?.defaultView?.frameElement) {
      ({ y: adjustY, x: adjustX, } =
        section.ownerDocument.defaultView.frameElement.getBoundingClientRect() ??
        {});
    }

    const { x = 0, y = 0, } =
      (section?.getBoundingClientRect && section.getBoundingClientRect()) ?? {};
    const iframe = document.getElementById(ATTRIBUTES.ATTRS.CONTENT_IFRAME);

    iframe.style.top = `${window.scrollY + adjustY + y}px`;
    iframe.style.left = `${window.scrollX + adjustX + x}px`;
  }, [ currentSection, parserType, sections, status, ]);

  return (
    <Container>
      {isLoading ? (
        <Icon
          alt="loading"
          src={SpinnerSvg} />
      ) : (
        enabled && (
          <>
            <Button
              type="button"
              onClick={() => {
                if (isPlaying) {
                  console.log('onPause');
                  onPause();
                } else {
                  console.log('onResume');
                  onResume();
                }
              }}
            >
              <Icon
                alt={isPlaying ? 'Pause' : 'Play'}
                src={isPlaying ? PauseSvg : PlaySvg}
              />
            </Button>
            <Button
              type="button"
              onClick={() => {
                console.log('onNextingtons');
                onNext();
              }}
            >
              <Icon
                alt="Next"
                src={NextSvg} />
            </Button>
          </>
        )
      )}
    </Container>
  );
}

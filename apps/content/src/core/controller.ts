import { fromEvent, combineLatest, } from 'rxjs';
import { tap, ignoreElements, map, } from 'rxjs/operators';

import { ATTRIBUTES, PLAYER_STATUS, VARIABLES, } from '@pericles/constants';
import {
  store,
  parserTypeSelector,
  setApp,
  setPlayer,
  playerPlay,
  playerStop,
  playerSoftHalt,
} from '@pericles/store';
import { isGoogleBook, } from '@pericles/util';

export default () => {
  const contextMenuOpen$ = fromEvent<MouseEvent>(document, 'contextmenu').pipe(
    tap((e) => {
      const textSelected = window.getSelection()?.toString?.() || '';
      if (textSelected.length) {
        store.dispatch(
          setApp({
            [VARIABLES.APP.SELECTED_TEXT]: textSelected,
          })
        );
      }
      store.dispatch(setApp({ skipUntilY: e.pageY, }));
    }),
    ignoreElements()
  );

  const wordClick$ = fromEvent<MouseEvent>(document, 'click').pipe(
    map((e) => {
      if (!e.target) return null;
      let wordEl: HTMLElement | null = e.target as HTMLElement;
      if (wordEl.tagName !== ATTRIBUTES.TAGS.WORD)
        wordEl =
          wordEl.querySelector(ATTRIBUTES.TAGS.WORD) ||
          wordEl.closest(ATTRIBUTES.TAGS.WORD);

      if (!wordEl) return null;
      const wordAudio = Number(
        wordEl.getAttribute(ATTRIBUTES.ATTRS.WORD_AUDIO) || 0
      );
      if (wordAudio < 0) return null;
      console.log('wordAudio', wordAudio);

      return true;
    }),
    ignoreElements()
  );

  const sectionClick$ = fromEvent<MouseEvent>(document, 'click').pipe(
    map((e) => {
      if (!e.target) return null;
      let sectionEl: HTMLElement | null = e.target as HTMLElement;
      if (sectionEl.tagName !== ATTRIBUTES.TAGS.SECTION)
        sectionEl = sectionEl.closest(ATTRIBUTES.TAGS.SECTION);
      console.log('sectionEl', sectionEl);

      if (!sectionEl) return null;
      const sectionId = Number(
        sectionEl.getAttribute(ATTRIBUTES.ATTRS.SECTION)
      );
      if (sectionId < 0) return null;
      console.log('sectionClick$.sectionId, section', sectionId, sectionEl);
      store.dispatch(playerSoftHalt());
      store.dispatch(
        setPlayer({ key: sectionId, status: PLAYER_STATUS.LOADING, })
      );
      setTimeout(() => {
        store.dispatch(playerPlay({ userGenerated: false, fromCursor: false, }));
      }, 300);

      return true;
    }),
    ignoreElements()
  );

  const googleBookNext$ = fromEvent<MouseEvent>(document, 'click').pipe(
    map((e) => {
      const state = store.getState();
      if (state === null) return;
      const target = e.target as HTMLElement;
      if (!isGoogleBook(parserTypeSelector(state))) return;
      const nextPageLabel = target.getAttribute('aria-label');
      if (
        nextPageLabel === 'Next Page' ||
        target.innerHTML === 'chevron_right'
      ) {
        console.log('googleBookNext$', target);
        store.dispatch(playerStop());
      }
    }),
    ignoreElements()
  );

  const googleBookPrev$ = fromEvent<MouseEvent>(document, 'click').pipe(
    map((e) => {
      const state = store.getState();
      if (state === null) return;
      const target = e.target as HTMLElement;
      if (!isGoogleBook(parserTypeSelector(state))) return;
      const prevPageLabel = target.getAttribute('aria-label');
      if (
        prevPageLabel === 'Previous Page' ||
        target.innerHTML === 'chevron_left'
      ) {
        console.log('googleBookPrev$', target);
        store.dispatch(playerStop());
      }
    }),
    ignoreElements()
  );

  // run
  combineLatest([
    contextMenuOpen$,
    wordClick$,
    sectionClick$,
    googleBookPrev$,
    googleBookNext$,
  ]).subscribe();
};

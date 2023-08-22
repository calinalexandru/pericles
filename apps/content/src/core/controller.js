// /* eslint-disable no-unused-vars */
import { fromEvent, combineLatest, } from 'rxjs';
import { tap, ignoreElements, map, } from 'rxjs/operators';

import { ATTRIBUTES, PLAYER_STATUS, VARIABLES, } from '@pericles/constants';
import {
  store,
  appActions,
  parserTypeSelector,
  playerActions,
} from '@pericles/store';
import { isGoogleBook, } from '@pericles/util';

const { app, } = appActions;
const { player, } = playerActions;

export default () => {
  const contextMenuOpen$ = fromEvent(document, 'contextmenu').pipe(
    tap((e) => {
      const textSelected = window.getSelection().toString();
      store.dispatch(
        app.set({
          [VARIABLES.APP.SELECTED_TEXT]: textSelected,
        })
      );
      store.dispatch(app.set({ skipUntilY: e.pageY, }));
    }),
    ignoreElements()
  );

  const wordClick$ = fromEvent(document, 'click').pipe(
    map(async (e) => {
      let wordEl = e.target;
      if (e.target.tagName !== ATTRIBUTES.TAGS.WORD)
        wordEl =
          wordEl.querySelector(ATTRIBUTES.TAGS.WORD) ||
          wordEl.closest(ATTRIBUTES.TAGS.WORD);

      if (!wordEl) return null;
      const wordAudio = wordEl.getAttribute(ATTRIBUTES.ATTRS.WORD_AUDIO);
      if (wordAudio < 0) return null;
      console.log('wordAudio', wordAudio);

      return true;
    }),
    ignoreElements()
  );

  const sectionClick$ = fromEvent(document, 'click').pipe(
    map((e) => {
      let sectionEl = e.target;
      if (e.target.tagName !== ATTRIBUTES.TAGS.SECTION)
        sectionEl = sectionEl.closest(ATTRIBUTES.TAGS.SECTION);
      console.log('sectionEl', sectionEl);

      if (!sectionEl) return null;
      const sectionId = Number(
        sectionEl.getAttribute(ATTRIBUTES.ATTRS.SECTION)
      );
      if (sectionId < 0) return null;
      console.log('sectionClick$.sectionId, section', sectionId, sectionEl);
      store.dispatch(player.softHalt());
      store.dispatch(
        player.set({ key: sectionId, status: PLAYER_STATUS.LOADING, })
      );
      setTimeout(() => {
        store.dispatch(player.play());
      }, 300);

      return true;
    }),
    ignoreElements()
  );

  const googleBookNext$ = fromEvent(document, 'click').pipe(
    map((e) => {
      const state = store.getState();
      if (!isGoogleBook(parserTypeSelector(state))) return true;
      const nextPageLabel = e.target.getAttribute('aria-label');
      if (
        nextPageLabel === 'Next Page' ||
        e.target.innerHTML === 'chevron_right'
      ) {
        console.log('googleBookNext$', e.target);
        store.dispatch(player.stop());
      }
      return true;
    }),
    ignoreElements()
  );

  const googleBookPrev$ = fromEvent(document, 'click').pipe(
    map((e) => {
      const state = store.getState();
      if (!isGoogleBook(parserTypeSelector(state))) return true;
      const prevPageLabel = e.target.getAttribute('aria-label');
      if (
        prevPageLabel === 'Previous Page' ||
        e.target.innerHTML === 'chevron_left'
      ) {
        console.log('googleBookPrev$', e.target);
        store.dispatch(player.stop());
      }

      return true;
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

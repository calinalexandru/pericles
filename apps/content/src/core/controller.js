// /* eslint-disable no-unused-vars */
import { fromEvent, combineLatest, } from 'rxjs';
import { tap, ignoreElements, map, } from 'rxjs/operators';

import store from '@/store';
import { ATTRIBUTES, PLAYER_STATUS, VARIABLES, } from '@pericles/constants';
import { appActions, parserTypeSelector, playerActions, } from '@pericles/store';
import { isGoogleBook, } from '@pericles/util';

const { app, } = appActions;
const { player, } = playerActions;

export default () => {
  const tabClosed$ = fromEvent(window, 'beforeunload').pipe(
    tap(async () => {
      const { periclesTabId: tab, } = window;
      await store.current.dispatch(app.tabClosed({ tab, }));
    })
  );

  const contextMenuOpen$ = fromEvent(document, 'contextmenu').pipe(
    tap(async (e) => {
      const textSelected = window.getSelection().toString();
      await store.current.dispatch(
        app.set({
          [VARIABLES.APP.SELECTED_TEXT]: textSelected,
        })
      );
      await store.current.dispatch(app.set({ skipUntilY: e.pageY, }));
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
      // const state = store.getState();
      // const section = playerKeySelector(state);
      // not ued
      // if (section !== Number(sectionIndex)) {
      //   await store.dispatch(player.softHalt());
      //   await store.dispatch(player.set({ key: Number(sectionIndex) }));
      //   await store.dispatch(
      //     player.play({
      //       key: Number(sectionIndex),
      //       userGenerated: true,
      //       seek: wordAudio,
      //     })
      //   );
      // }
      // await store.dispatch(player.seek(wordAudio));

      return true;
    }),
    ignoreElements()
  );

  const sectionClick$ = fromEvent(document, 'click').pipe(
    map(async (e) => {
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
      await store.current.dispatch(player.softHalt());
      await store.current.dispatch(
        player.set({ key: sectionId, status: PLAYER_STATUS.LOADING, })
      );
      setTimeout(async () => {
        await store.current.dispatch(player.play());
      }, 300);

      return true;
    }),
    ignoreElements()
  );

  const googleBookNext$ = fromEvent(document, 'click').pipe(
    map(async (e) => {
      const state = store.current.getState();
      if (!isGoogleBook(parserTypeSelector(state))) return true;
      const nextPageLabel = e.target.getAttribute('aria-label');
      if (
        nextPageLabel === 'Next Page' ||
        e.target.innerHTML === 'chevron_right'
      ) {
        console.log('googleBookNext$', e.target);
        await store.current.dispatch(player.stop());
      }
      return true;
    }),
    ignoreElements()
  );

  const googleBookPrev$ = fromEvent(document, 'click').pipe(
    map(async (e) => {
      const state = store.getState();
      if (!isGoogleBook(parserTypeSelector(state))) return true;
      const prevPageLabel = e.target.getAttribute('aria-label');
      if (
        prevPageLabel === 'Previous Page' ||
        e.target.innerHTML === 'chevron_left'
      ) {
        console.log('googleBookPrev$', e.target);
        await store.current.dispatch(player.stop());
      }

      return true;
    }),
    ignoreElements()
  );

  // run
  combineLatest([
    tabClosed$,
    contextMenuOpen$,
    wordClick$,
    sectionClick$,
    googleBookPrev$,
    googleBookNext$,
  ]).subscribe();
};

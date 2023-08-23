// /* eslint-disable no-unused-vars */
import { keys, } from 'ramda';
import { fromEvent, combineLatest, } from 'rxjs';
import { tap, ignoreElements, } from 'rxjs/operators';

import {
  store,
  hotkeysDisableSelector,
  hotkeysSelector,
  playerPlay,
  playerToggle,
  playerStop,
  playerSoftNext,
  playerSoftPrev,
} from '@pericles/store';

const userIsTyping = (e) => {
  const { target, } = e;
  const tagName = target.tagName.toLocaleLowerCase();
  const inputTags = [ 'input', 'textarea', ];
  const output =
    inputTags.includes(tagName) || target.hasAttribute('contenteditable');
  console.log('userIsTyping: target, output', target, output);
  return output;
};

export default () => {
  const hotkeyEvents = {
    start: () => {
      console.log('hotkeyEvents.start');
      store.dispatch(playerPlay({ userGenerated: true, }));
    },
    play: () => {
      console.log('hotkeyEvents.toggle');
      store.dispatch(playerToggle());
    },
    stop: () => {
      console.log('hotkeyEvents.stop');
      store.dispatch(playerStop());
    },
    next: () => {
      console.log('hotkeyEvents.next');
      store.dispatch(playerSoftNext());
    },
    prev: () => {
      console.log('hotkeyEvents.prev');
      store.dispatch(playerSoftPrev());
    },
  };
  let keysMap = Object.create(null);
  const onKeyPress$ = fromEvent(document, 'keydown').pipe(
    tap((e) => {
      if (userIsTyping(e)) return;
      console.log('onKeyPress$', e);
      keysMap[e.code] = { key: e.key, code: e.code, };
      const state = store.getState();
      const hotkeys = hotkeysSelector(state);
      const activeHotkeys = keys(keysMap)
        .filter((k) => keysMap[k] !== false)
        .map((k) => keysMap[k].code)
        .sort();
      console.log('activeHotkeys', activeHotkeys);
      const curEvent = Object.keys(hotkeyEvents).find((evt) => {
        const candidates = hotkeys[evt].map((key) => key.code).sort();
        console.log('candidates', candidates);
        return JSON.stringify(activeHotkeys) === JSON.stringify(candidates);
      });
      if (!hotkeysDisableSelector(state) && curEvent && hotkeyEvents[curEvent])
        hotkeyEvents[curEvent]();
    }),
    ignoreElements()
  );

  const onKeyRelease$ = fromEvent(document, 'keyup').pipe(
    tap(() => {
      keysMap = Object.create(null);
    }),
    ignoreElements()
  );

  // run
  combineLatest([ onKeyPress$, onKeyRelease$, ]).subscribe();
};

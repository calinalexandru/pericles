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

const userIsTyping = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement;
  const tagName = target.tagName.toLocaleLowerCase();
  const inputTags = [ 'input', 'textarea', ];
  const output =
    inputTags.includes(tagName) || target.hasAttribute('contenteditable');
  console.log('userIsTyping: target, output', target, output);
  return output;
};

export default () => {
  const hotkeyEvents: any = {
    start: () => {
      console.log('hotkeyEvents.start');
      store.dispatch(playerPlay({ userGenerated: true, fromCursor: false, }));
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

  let keysMap: { [key: string]: { key: string; code: string } } =
    Object.create(null);

  const onKeyPress$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    tap((e) => {
      if (userIsTyping(e)) return;
      console.log('onKeyPress$', e);
      keysMap[e.code] = { key: e.key, code: e.code, };
      const state = store.getState();
      if (state === null) return;
      const hotkeys: any = hotkeysSelector(state);
      const activeHotkeys = Object.keys(keysMap)
        .filter((k: string) => keysMap[k] !== null)
        .map((k: string) => keysMap[k].code)
        .sort();
      console.log('activeHotkeys', activeHotkeys);
      // console.log('keysMap', keysMap)
      const curEvent = Object.keys(hotkeyEvents).find((evt) => {
        const candidates = hotkeys[evt]
          .map((key: { code: string }) => key.code)
          .sort();
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

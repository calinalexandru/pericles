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
  HotkeysState,
} from '@pericles/store';

const userIsTyping = (e: KeyboardEvent): boolean => {
  const target = e.target as HTMLElement;
  const tagName = target.tagName.toLocaleLowerCase();
  const inputTags = [ 'input', 'textarea', ];
  return inputTags.includes(tagName) || target.hasAttribute('contenteditable');
};

export default () => {
  type HotkeyEvent = 'start' | 'play' | 'stop' | 'next' | 'prev';

  const hotkeyEvents = new Map<HotkeyEvent, () => void>();
  hotkeyEvents.set('start', () => {
    store.dispatch(
      playerPlay.request({ userGenerated: true, fromCursor: false, })
    );
  });
  hotkeyEvents.set('play', () => {
    store.dispatch(playerToggle());
  });
  hotkeyEvents.set('stop', () => {
    store.dispatch(playerStop());
  });
  hotkeyEvents.set('next', () => {
    store.dispatch(playerSoftNext());
  });
  hotkeyEvents.set('prev', () => {
    store.dispatch(playerSoftPrev());
  });

  const keysMap: Map<string, { key: string; code: string }> = new Map();

  const onKeyPress$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    tap((e) => {
      if (userIsTyping(e)) return;
      keysMap.set(e.code, { key: e.key, code: e.code, });
      const state = store.getState();
      if (!state) return;
      const hotkeys: HotkeysState = hotkeysSelector(state);

      const activeHotkeys = Array.from(keysMap.values())
        .map((entry) => entry.code)
        .sort();

      const curEvent = Array.from(hotkeyEvents.keys()).find((evt) => {
        const entries = Object.entries(hotkeys);

        const matchingEntry = entries.find(([ key, ]) => key === evt);
        if (!matchingEntry) return false;

        const [ , value, ] = matchingEntry;
        if (!Array.isArray(value)) return false;

        const candidates = value.map((key) => key.code).sort();
        return JSON.stringify(activeHotkeys) === JSON.stringify(candidates);
      }) as HotkeyEvent | undefined;

      if (
        !hotkeysDisableSelector(state) &&
        curEvent &&
        hotkeyEvents.has(curEvent)
      ) {
        hotkeyEvents.get(curEvent)!();
      }
    }),
    ignoreElements()
  );

  const onKeyRelease$ = fromEvent(document, 'keyup').pipe(
    tap(() => {
      keysMap.clear();
    }),
    ignoreElements()
  );

  combineLatest([ onKeyPress$, onKeyRelease$, ]).subscribe();
};

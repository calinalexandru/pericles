import { PayloadAction, getType, } from '@reduxjs/toolkit';
import { Epic, ofType, } from 'redux-observable';
import {
  debounceTime,
  filter,
  ignoreElements,
  map,
  pluck,
  tap,
} from 'rxjs/operators';

import Autoscroll from '@/util/autoscroll';
import {
  ATTRIBUTES,
  PARSER_TYPES,
  WORD_TRACKER_STYLES,
} from '@pericles/constants';
import {
  RootState,
  appActions,
  appAutoscrollSelector,
  appHighlightColorSelector,
  appHighlightStyleSelector,
  appSectionTrackerSelector,
  appWordTrackerColorSelector,
  appWordTrackerSelector,
  appWordTrackerStyleSelector,
  combineAnyEpics,
  parserTypeSelector,
  playerKeySelector,
  playerSectionsSelector,
} from '@pericles/store';
import {
  addClassToElements,
  getRectSectionsById,
  getSectionsById,
  getSectionWords,
  removeClassFromAll,
  setSectionBackground,
  setWordBackground,
} from '@pericles/util';

const appNewContentEpic: Epic<any> = (action) =>
  action.pipe(
    ofType(getType(appActions.newContent)),
    pluck('payload'),
    filter((payload: any = {}) => {
      console.log('appnewContentEpic', payload);

      return !payload?.iframe;
    }),
    map(appActions.highlightReloadSettings)
  );

const appReloadTabEpic: Epic<any> = (action) =>
  action.pipe(
    ofType(getType(appActions.reloadTab)),
    tap(() => {
      console.log('appReloadTabEpic');
      window.location.reload();
    }),
    ignoreElements()
  );

const highlightSectionEpic: Epic<PayloadAction, PayloadAction, RootState> = (
  action$,
  state
) =>
  action$.pipe(
    ofType(getType(appActions.highlightSection)),
    tap(() => {
      console.log(
        'highlightSectionEpic.init',
        appSectionTrackerSelector(state.value)
      );
    }),
    filter(() => appSectionTrackerSelector(state.value) === true),
    tap(() => {
      const highlightStyle = appHighlightStyleSelector(state.value);
      const wordHighlightStyle = appWordTrackerStyleSelector(state.value);
      if (wordHighlightStyle === WORD_TRACKER_STYLES.FADE)
        removeClassFromAll(wordHighlightStyle);
      removeClassFromAll(highlightStyle);
      if (parserTypeSelector(state.value) === PARSER_TYPES.GOOGLE_DOC_SVG) {
        const activeRectSections = getRectSectionsById(
          playerKeySelector(state.value)
        );
        addClassToElements(activeRectSections, highlightStyle);
      } else {
        const activeSections = getSectionsById(playerKeySelector(state.value));
        console.log('highlightSectionEpic', {
          playerKey: playerKeySelector(state.value),
          activeSections,
          highlightStyle,
        });
        addClassToElements(activeSections, highlightStyle);
      }
    }),
    ignoreElements()
  );

const highlightWordEpic: Epic<PayloadAction, PayloadAction, RootState> = (
  action$,
  state
) =>
  action$.pipe(
    ofType(getType(appActions.highlightWord)),
    filter(() => appWordTrackerSelector(state.value) === true),
    pluck('payload'),
    tap((data: any) => {
      const { charIndex, charLength, } = data;
      const parserKey = playerKeySelector(state.value);
      const wordList = getSectionWords(parserKey);
      const wordTrackerStyle = appWordTrackerStyleSelector(state.value);
      const isFade = wordTrackerStyle === WORD_TRACKER_STYLES.FADE;
      const activeSections = getSectionWords(parserKey).filter(
        (word) =>
          Number(word.getAttribute(ATTRIBUTES.ATTRS.WORD)) >= // + word.textContent.length >=
          charIndex // + charLength
      );
      // console.log('activeSections', activeSections);
      console.log('highlight.word', {
        charIndex,
        charLength,
        parserKey,
        activeSections,
        words: getSectionWords(parserKey),
      });
      if (activeSections[0]) {
        if (isFade) {
          const prevSections = wordList
            .slice(0, wordList.length - activeSections.length)
            .filter(
              (word) =>
                word.className.indexOf(ATTRIBUTES.ATTRS.PREV_WORD_TRACKER) ===
                -1
            );
          // console.log('prevSection', prevSections);
          prevSections.forEach((ps) =>
            ps.classList.add(ATTRIBUTES.ATTRS.PREV_WORD_TRACKER)
          );
        }

        removeClassFromAll(wordTrackerStyle);
        if (isFade) {
          const prevWord = activeSections[0].previousElementSibling;
          if (prevWord)
            prevWord.classList.add(ATTRIBUTES.ATTRS.PREV_WORD_TRACKER);
        }
        activeSections[0].classList.add(wordTrackerStyle);
      }
    }),
    ignoreElements()
  );

const autoscrollRunEpic: Epic<
  PayloadAction<{ section: number }>,
  never,
  RootState
> = (action, state) =>
  action.pipe(
    ofType(getType(appActions.autoscrollSet)),
    debounceTime(500),
    map((act) => act.payload.section),
    tap((section) => {
      const parserType = parserTypeSelector(state.value);
      const { top = 0, } =
        playerSectionsSelector(state.value)?.[section]?.pos || {};
      console.log('autoscroll.set', { top, });
      if (appAutoscrollSelector(state.value) && top)
        Autoscroll.to(top, parserType);
    }),
    ignoreElements()
  );

const autoscrollClearEpic: Epic<PayloadAction, PayloadAction, RootState> = (
  action$
) =>
  action$.pipe(
    ofType(getType(appActions.autoscrollClear)),
    tap(() => {
      Autoscroll.clear();
    }),
    ignoreElements()
  );

const highlightReloadSettingsEpic: Epic<
  PayloadAction,
  PayloadAction,
  RootState
> = (action, state) =>
  action.pipe(
    ofType(getType(appActions.highlightReloadSettings)),
    tap(() => {
      console.log('highlight.reloadSettings epic', state.value);
      setWordBackground(appWordTrackerColorSelector(state.value));
      setSectionBackground(appHighlightColorSelector(state.value));
    }),
    ignoreElements()
  );

const highlightClearWordsEpic: Epic<PayloadAction, PayloadAction, RootState> = (
  action,
  state
) =>
  action.pipe(
    ofType(getType(appActions.highlightClearWords)),
    tap(() => {
      // console.log('highlight.clearWords');
      removeClassFromAll(appWordTrackerStyleSelector(state.value));
      removeClassFromAll(ATTRIBUTES.ATTRS.PREV_WORD_TRACKER);
    }),
    ignoreElements()
  );

const highlightClearSectionsEpic: Epic<
  PayloadAction,
  PayloadAction,
  RootState
> = (action, state) =>
  action.pipe(
    ofType(getType(appActions.highlightClearSections)),
    tap(() => {
      // console.log('highlight.clearSections');
      removeClassFromAll(appHighlightStyleSelector(state.value));
    }),
    ignoreElements()
  );

export default combineAnyEpics(
  appReloadTabEpic,
  appNewContentEpic,
  highlightSectionEpic,
  highlightWordEpic,
  autoscrollRunEpic,
  autoscrollClearEpic,
  highlightReloadSettingsEpic,
  highlightClearWordsEpic,
  highlightClearSectionsEpic
);

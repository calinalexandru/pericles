import { combineEpics, ofType, } from 'redux-observable';
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
  appActions,
  appAutoscrollSelector,
  appHighlightColorSelector,
  appHighlightStyleSelector,
  appSectionTrackerSelector,
  appWordTrackerColorSelector,
  appWordTrackerSelector,
  appWordTrackerStyleSelector,
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

const { highlight, autoscroll, app, } = appActions;

const appNewContentEpic = (action) =>
  action.pipe(
    ofType(app.newContent),
    pluck('payload'),
    filter((payload = {}) => {
      console.log('appnewContentEpic', payload);

      return !payload.iframe;
    }),
    map(() => highlight.reloadSettings())
  );

const appReloadTabEpic = (action) =>
  action.pipe(
    ofType(app.reloadTab),
    tap(() => {
      console.log('appReloadTabEpic');
      window.location.reload();
    }),
    ignoreElements()
  );

const highlightSectionEpic = (action$, state) =>
  action$.pipe(
    ofType(highlight.section),
    tap(() => {
      console.log(
        'highlightSectionEpic.init',
        appSectionTrackerSelector(state.value)
      );
    }),
    filter(() => appSectionTrackerSelector(state.value) === true),
    tap(() => {
      const highlightStyle = appHighlightStyleSelector(state.value);
      if (appWordTrackerStyleSelector === WORD_TRACKER_STYLES.FADE)
        removeClassFromAll(ATTRIBUTES.ATTRS.PREV_WORD_TRACKER);
      removeClassFromAll(highlightStyle);
      if (parserTypeSelector(state.value) === PARSER_TYPES.GOOGLE_DOC_SVG) {
        const activeRectSections = getRectSectionsById(
          playerKeySelector(state.value)
        );
        addClassToElements(activeRectSections, highlightStyle);
      } else {
        const activeSections = getSectionsById(playerKeySelector(state.value));
        // console.log('highlightSectionEpic', {
        //   playerKey: playerKeySelector(state.value),
        //   activeSections,
        //   highlightStyle,
        // });
        addClassToElements(activeSections, highlightStyle);
      }
    }),
    map(() => highlight.sectionComplete())
  );

const highlightWordEpic = (action$, state) =>
  action$.pipe(
    ofType(highlight.word),
    filter(() => appWordTrackerSelector(state.value) === true),
    pluck('payload'),
    tap((data) => {
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

const autoscrollRunEpic = (action$, state) =>
  action$.pipe(
    ofType(autoscroll.set),
    debounceTime(500),
    pluck('payload', 'section'),
    tap((section) => {
      const parserType = parserTypeSelector(state.value);
      const { top = 0, } =
        playerSectionsSelector(state.value)?.[section]?.pos || {};
      console.log('autoscroll.set', { top, });
      if (appAutoscrollSelector(state.value)) Autoscroll.to(top, parserType);
    }),
    ignoreElements()
  );

const autoscrollClearEpic = (action$) =>
  action$.pipe(
    ofType(autoscroll.clear),
    tap(() => {
      Autoscroll.clear();
    }),
    ignoreElements()
  );

const highlightReloadSettingsEpic = (action, state) =>
  action.pipe(
    ofType(highlight.reloadSettings),
    tap(() => {
      console.log('highlight.reloadSettings epic', state.value);
      setWordBackground(appWordTrackerColorSelector(state.value));
      setSectionBackground(appHighlightColorSelector(state.value));
    }),
    ignoreElements()
  );

const highlightClearAllEpic = (action, state) =>
  action.pipe(
    ofType(highlight.clearAll),
    tap(() => {
      // console.log('highlight.clearAll');
      removeClassFromAll(appWordTrackerStyleSelector(state.value));
      removeClassFromAll(ATTRIBUTES.ATTRS.PREV_WORD_TRACK_STYLE_FADE);
      removeClassFromAll(appHighlightStyleSelector(state.value));
    }),
    map(() => highlight.clearAllComplete())
  );

const highlightClearWordsEpic = (action, state) =>
  action.pipe(
    ofType(highlight.clearWords),
    tap(() => {
      // console.log('highlight.clearWords');
      removeClassFromAll(appWordTrackerStyleSelector(state.value));
      removeClassFromAll(ATTRIBUTES.ATTRS.PREV_WORD_TRACK_STYLE_FADE);
    }),
    map(() => highlight.clearWordsComplete())
  );

const highlightClearSectionsEpic = (action, state) =>
  action.pipe(
    ofType(highlight.clearSections),
    tap(() => {
      // console.log('highlight.clearSections');
      removeClassFromAll(appHighlightStyleSelector(state.value));
    }),
    map(() => highlight.clearSectionsComplete())
  );

export default combineEpics(
  appReloadTabEpic,
  appNewContentEpic,
  highlightSectionEpic,
  highlightWordEpic,
  autoscrollRunEpic,
  autoscrollClearEpic,
  highlightReloadSettingsEpic,
  highlightClearAllEpic,
  highlightClearWordsEpic,
  highlightClearSectionsEpic
);

import { PayloadAction, } from '@reduxjs/toolkit';
import { Action, } from 'redux';
import { Observable, from, } from 'rxjs';

import DomStrategy from '@/strategy/DomStrategy';
import {
  ATTRIBUTES,
  PARSER_TYPES,
  PLAYER_STATUS,
  ParserIframesType,
  ParserTypes,
  SectionType,
  VoiceType,
} from '@pericles/constants';
import {
  RootState,
  appActions,
  appSkipUntilYSelector,
  notificationError,
  parserIframesSelector,
  parserKeySelector,
  parserPageSelector,
  playerEnd,
  playerIdle,
  playerNext,
  playerProxyPlay,
  playerSectionsSelector,
  playerStop,
  sectionsRequestAndPlay,
  setParser,
  setPlayer,
  setSections,
  settingsVoiceSelector,
  settingsVoicesSelector,
} from '@pericles/store';
import {
  findAvailableIframe,
  findWorkingIframe,
  getIframesForStore,
  getIsoLangFromString,
  getParserType,
  isGoogleBook,
  isGoogleUtility,
  isGrammarlyApp,
  isIframeParsing,
  isPdfPage,
  isWindowTop,
  splitSentencesIntoWords,
  t,
} from '@pericles/util';

export type PayloadType = {
  iframe?: boolean;
  iframes?: ParserIframesType;
  userGenerated?: boolean;
  fromCursor?: boolean;
  working?: boolean;
  tab?: number;
};

export type PayloadResponseType = {
  type?: ParserTypes;
  fromCursor?: boolean;
  sections?: SectionType[];
  end?: boolean;
  iframeBlocked?: boolean;
  pageIndex?: number;
  tab?: number;
  iframes?: ParserIframesType;
  skip?: boolean;
  message?: string;
  error?: string;
  maxPage?: number;
};

const domStrategy = new DomStrategy();

const isAsianLanguage = (state: RootState): boolean => {
  const voiceProp = settingsVoiceSelector(state);
  const voices = settingsVoicesSelector(state);
  if (voices.at(voiceProp)) {
    const mergedLanguages = [ 'ja', 'cn', 'ko', ];
    const { lang, } = voices.at(voiceProp) as VoiceType;
    return !!mergedLanguages.includes(getIsoLangFromString(lang));
  }
  return false;
};

const shouldSkipParsing = (
  parserType: ParserTypes,
  parserIframes: ParserIframesType
): boolean => {
  const windowIsIframe = !isWindowTop();
  const { hostname, } = window.location;
  return (
    (isGoogleBook(parserType) && !windowIsIframe) ||
    (!isGoogleUtility(parserType) &&
      !windowIsIframe &&
      findWorkingIframe(parserIframes) !== false) ||
    (!isGoogleUtility(parserType) &&
      windowIsIframe &&
      !isIframeParsing(hostname, parserIframes))
  );
};

const prepareIframesData = (
  parserType: ParserTypes,
  parserIframes: ParserIframesType
): ParserIframesType =>
  (Object.keys(parserIframes).length && parserIframes) ||
  (!isGoogleUtility(parserType) && getIframesForStore(window)) ||
  {};

const processSections = (
  out: SectionType[],
  jpLang: boolean,
  parserKey: number
): SectionType[] => {
  if (!out.length) return [];
  const sectionsArr = out.map((data) => data.text);
  splitSentencesIntoWords(
    Object.keys(sectionsArr).map(
      (key: string) => Number(parserKey) + Number(key)
    ),
    jpLang
  );
  return out.map(({ text, pos, }) => ({ text, ...(pos && { pos, }), }));
};

const handleDomStrategy = (
  parserType: ParserTypes,
  iframes: ParserIframesType,
  state: RootState,
  payload: PayloadType
) => {
  const userGenerated = payload?.userGenerated || false;
  const fromCursor = payload.fromCursor || false;
  const parserKey = parserKeySelector(state);
  const skipUntilY = appSkipUntilYSelector(state);

  domStrategy.setup(
    parserType,
    parserKey,
    userGenerated,
    fromCursor ? skipUntilY : 0,
    iframes
  );

  return domStrategy.getSections();
};

export const mapPayloadToResponse = (
  payload: PayloadType,
  state: RootState
): PayloadResponseType => {
  console.log('mapPayloadToResponse', { payload, state, });
  const parserType = getParserType(window);
  if (isGrammarlyApp(parserType))
    return { skip: true, message: t`grammarly_app_not_supported`, };
  if (isPdfPage(window)) return { error: 'Pdf page error', };
  if (
    shouldSkipParsing(
      parserType,
      payload?.iframes || parserIframesSelector(state)
    )
  )
    return { skip: true, };

  const iframes = prepareIframesData(
    parserType,
    payload?.iframes || parserIframesSelector(state)
  );

  const fromCursor = payload.fromCursor || false;
  const tab = payload.tab || 0;
  const parserKey = parserKeySelector(state);
  const isAsian = isAsianLanguage(state);

  const { out, maxPage, pageIndex, end, iframeBlocked, } = handleDomStrategy(
    parserType,
    iframes,
    state,
    payload
  );
  const sections = processSections(out, isAsian, parserKey);

  return {
    iframeBlocked,
    sections,
    fromCursor,
    iframes,
    end:
      (
        [
          PARSER_TYPES.GOOGLE_DOC,
          PARSER_TYPES.GOOGLE_DOC_SVG,
          PARSER_TYPES.GOOGLE_BOOK,
          PARSER_TYPES.GOOGLE_FORM,
        ] as ParserTypes[]
      ).includes(parserType) ||
      sections.length < ATTRIBUTES.MISC.MIN_SECTIONS ||
      end,
    maxPage,
    pageIndex,
    type: parserType,
    tab,
  };
};

const handleError = () =>
  from([
    setPlayer({ status: PLAYER_STATUS.ERROR, }),
    sectionsRequestAndPlay.success(),
    appActions.routeErrorPdf(),
  ]);

const handleIframeEnd = (
  iframes: ParserIframesType,
  sectionsArr: SectionType[],
  state: RootState
) => {
  const mergeSections = [ ...playerSectionsSelector(state), ...sectionsArr, ];
  const currIframe = findWorkingIframe(iframes);
  const newIframePayload = { ...iframes, };
  if (
    typeof currIframe === 'string' &&
    Object.hasOwn(newIframePayload, currIframe)
  ) {
    /* eslint-disable-next-line security/detect-object-injection */
    newIframePayload[currIframe].parsing = false;
  }

  return from([
    setSections({ sections: mergeSections, }),
    setParser({ iframes: newIframePayload, }),
    playerNext({ auto: true, }),
  ]);
};

const handleIframeStart = (
  iframes: ParserIframesType,
  sectionsArr: SectionType[],
  state: RootState,
  end: boolean,
  type: ParserTypes,
  pageIndex: number,
  maxPage: number
) => {
  const availableIframeKey: string | boolean = findAvailableIframe(iframes);
  let newIframes = iframes;
  if (availableIframeKey !== false) {
    newIframes = {
      ...iframes,
      [availableIframeKey as string]: {
        ...iframes[availableIframeKey as string],
        parsing: true,
      },
    };
  }
  const mergeSections = [ ...playerSectionsSelector(state), ...sectionsArr, ];
  return from([
    setSections({ sections: mergeSections, }),
    setParser({ iframes, end, type, maxPage, page: pageIndex, }),
    playerEnd({ iframes: newIframes, }),
  ]);
};

const handleMessageEnd = (message: string) =>
  from([
    playerStop(),
    sectionsRequestAndPlay.failure(new Error(message)),
    notificationError({ text: message, }),
  ]);

const handleSkip = () => from([ playerIdle(), ]);

const handleDefault = (
  sectionsArr: SectionType[],
  type: ParserTypes,
  state: RootState,
  iframes: ParserIframesType,
  pageIndex: number,
  maxPage: number,
  end: boolean,
  tab: number
) => {
  const mergeSections = [ ...playerSectionsSelector(state), ...sectionsArr, ];
  return from(
    maxPage === 0 || maxPage > parserPageSelector(state)
      ? [
        setSections({ sections: mergeSections, }),
        setParser({
          ...(iframes && { iframes, }),
          key: mergeSections.length,
          end,
          type,
          maxPage,
          page: pageIndex,
        }),
        playerProxyPlay({ tab, }),
        sectionsRequestAndPlay.success(),
      ]
      : [ playerStop(), sectionsRequestAndPlay.success(), ]
  );
};

export const processResponse = (
  {
    message = '',
    skip = false,
    end = false,
    iframeBlocked = false,
    maxPage = 0,
    type = PARSER_TYPES.DEFAULT,
    pageIndex = 0,
    iframes = {},
    sections: sectionsArr = [],
    tab = 0,
    error = '',
  }: PayloadResponseType,
  state: RootState
): Observable<PayloadAction<any>> => {
  console.log('processResponse', {
    message,
    skip,
    end,
    maxPage,
    type,
    iframes,
    sectionsArr,
    tab,
    error,
    state,
  });
  const windowIsIframe = !isWindowTop();

  if (error) return handleError();
  if (windowIsIframe && end)
    return handleIframeEnd(iframes, sectionsArr, state);
  if (!windowIsIframe && iframeBlocked)
    return handleIframeStart(
      iframes,
      sectionsArr,
      state,
      end,
      type,
      pageIndex,
      maxPage
    );
  if (message && end) return handleMessageEnd(message);
  if (skip) return handleSkip();
  return handleDefault(
    sectionsArr,
    type,
    state,
    iframes,
    pageIndex,
    maxPage,
    end,
    tab
  );
};

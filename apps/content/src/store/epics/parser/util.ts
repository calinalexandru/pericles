import { Action, } from 'redux';
import { Observable, from, } from 'rxjs';
import { tap, } from 'rxjs/operators';

import DomStrategy from '@/strategy/domStrategy';
import {
  ATTRIBUTES,
  PARSER_TYPES,
  PLAYER_STATUS,
  ParserIframesType,
  ParserTypes,
  SectionType,
} from '@pericles/constants';
import {
  RootState,
  appSkipUntilYSelector,
  notificationError,
  parserIframesSelector,
  parserKeySelector,
  parserPageSelector,
  playerIdle,
  playerNext,
  playerProxyPlay,
  playerSectionsSelector,
  playerStop,
  routeErrorPdf,
  sectionsRequestAndPlay,
  setParser,
  setPlayer,
  setSections,
  settingsVoiceSelector,
} from '@pericles/store';
import {
  findWorkingIframe,
  getIframesForStore,
  getParserType,
  getPremiumVoiceId,
  isGoogleBook,
  isGoogleUtility,
  isGrammarlyApp,
  isIframeParsing,
  isPdfPage,
  isPremiumVoice,
  splitSentencesIntoWords,
  t,
} from '@pericles/util';

export const mergedLanguages = [ 'ja', 'cn', 'ko', ];

export type PayloadType = {
  iframe?: boolean;
  iframes?: any;
  userGenerated?: boolean;
  fromCursor?: boolean;
  working?: boolean;
  tab?: number;
};

export const logInitialData = () =>
  tap((data: any) => {
    console.log('getSectionsAndPlayEpic.init', data);
  });

export const logSectionData = () =>
  tap((data: any) => {
    console.log('sectionsData', data);
  });

export type PayloadResponseType = {
  type?: ParserTypes;
  fromCursor?: boolean;
  sections?: SectionType[];
  end?: boolean;
  isIframe?: boolean;
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

export const mapPayloadToResponse = (
  payload: PayloadType,
  state: RootState
): PayloadResponseType => {
  console.log('mapPayloadToResponse.payload', payload);
  const parserType = getParserType(window);
  console.log('getSectionsAndPlayEpic.parserType', parserType);
  if (isGrammarlyApp(parserType)) {
    return {
      skip: true,
      message: t`grammarly_app_not_supported`,
    };
  }

  const isIframe = payload.iframe;
  const { hostname, } = window.location;
  if (isPdfPage(window)) {
    return {
      error: 'Pdf page error',
    };
  }
  const parserIframes = payload?.iframes || parserIframesSelector(state);
  // if (
  //   (isGoogleBook(parserType) && !isIframe) ||
  //   (!isGoogleUtility(parserType) &&
  //     !isIframe &&
  //     findWorkingIframe(parserIframes) !== false) ||
  //   (!isGoogleUtility(parserType) &&
  //     isIframe &&
  //     !isIframeParsing(hostname, parserIframes))
  // ) {
  //   return { skip: true, };
  // }

  const iframes =
    (Object.keys(parserIframes).length && parserIframes) ||
    (!isGoogleUtility(parserType) && getIframesForStore(window)) ||
    {};
  const userGenerated = payload?.userGenerated || false;
  const fromCursor = payload.fromCursor || false;
  const tab = payload.tab || 0;
  const parserKey = parserKeySelector(state);
  const voiceProp = settingsVoiceSelector(state);
  const skipUntilY = appSkipUntilYSelector(state);
  const voices: any = settingsVoiceSelector(state);
  const newVoiceProp = isPremiumVoice(voiceProp)
    ? getPremiumVoiceId(voiceProp)
    : voiceProp;
  const { lang, } = voices[newVoiceProp] || {};
  const jpLang = !!mergedLanguages.includes(lang);

  // const domStrategy = new DomStrategy({
  //   parserType,
  //   userGenerated,
  //   skipUntilY,
  //   parserKey,
  //   parserIframes,
  //   fromCursor,
  // });

  domStrategy.reset();

  domStrategy.type = parserType;
  domStrategy.userGenerated = userGenerated;
  domStrategy.skipUntilY = skipUntilY;
  domStrategy.parserKey = parserKey;
  domStrategy.fromCursor = fromCursor;

  const { out, maxPage, pageIndex, end, iframeBlocked, } =
    domStrategy.getSections();

  console.log('domStrategy.getSections', {
    userGenerated,
    out,
    maxPage,
    pageIndex,
    end,
    iframeBlocked,
  });

  if (!out.length)
    return {
      iframeBlocked,
      fromCursor,
      iframes,
      isIframe,
      sections: [],
      end: true,
      type: parserType,
      maxPage,
      tab,
      pageIndex,
    };

  const sectionsArr = out.map((data) => data.text);
  splitSentencesIntoWords(
    Object.keys(sectionsArr).map(
      (key: string) => Number(parserKey) + Number(key)
    ),
    jpLang
  );

  return {
    iframeBlocked,
    sections: out.map(({ text, pos, }) => ({ text, ...(pos && { pos, }), })),
    fromCursor,
    iframes,
    isIframe,
    end:
      (
        [
          PARSER_TYPES.GOOGLE_DOC,
          PARSER_TYPES.GOOGLE_DOC_SVG,
          PARSER_TYPES.GOOGLE_BOOK,
          PARSER_TYPES.GOOGLE_FORM,
        ] as ParserTypes[]
      ).includes(parserType) ||
      sectionsArr.length < ATTRIBUTES.MISC.MIN_SECTIONS ||
      end,
    maxPage,
    pageIndex,
    type: parserType,
    tab,
  };
};

export const processResponse = (
  {
    fromCursor = false,
    message = '',
    skip = false,
    end = false,
    iframeBlocked = false,
    maxPage = 0,
    type = PARSER_TYPES.DEFAULT,
    pageIndex = 0,
    iframes = {},
    isIframe = false,
    sections: sectionsArr = [],
    tab = 0,
    error = '',
  }: PayloadResponseType,
  state: RootState
): Observable<Action<any>> => {
  if (error) {
    return from([
      setPlayer({ status: PLAYER_STATUS.ERROR, }),
      sectionsRequestAndPlay.success(),
      routeErrorPdf(),
    ]);
  }
  // if (!isIframe && iframeBlocked) {
  //   console.log('got into the iframe garbage');
  //   const availableIframeKey: string | boolean = findAvailableIframe(iframes);
  //   let newIframes = iframes;
  //   if (availableIframeKey !== false) {
  //     newIframes = {
  //       ...iframes,
  //       ...{
  //         [availableIframeKey as string]: {
  //           ...iframes[availableIframeKey as string],
  //           parsing: true,
  //         },
  //       },
  //     };
  //   }
  //   console.log('newIframes', newIframes);
  //   return from([
  //     setParser({
  //       iframes,
  //       end,
  //       type,
  //       maxPage,
  //       page: pageIndex,
  //     }),
  //     playerEnd({
  //       fromCursor,
  //       iframes: newIframes,
  //     }),
  //   ]);
  // }
  if (message && end) {
    console.log('got end and message', { message, end, });
    return from([
      playerStop(),
      sectionsRequestAndPlay.failure(new Error(message)),
      notificationError({ text: message, }),
    ]);
  }

  if (skip) {
    return from([ playerIdle(), ]);
  }

  const mergeSections = [ ...playerSectionsSelector(state), ...sectionsArr, ];
  console.log({ mergeSections, });
  if (!mergeSections.length && isGoogleBook(type)) {
    return from([
      setParser({ type, maxPage, page: pageIndex, end, }),
      playerNext({ auto: false, }),
    ]);
  }
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

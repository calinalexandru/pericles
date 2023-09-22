/* html */
export { default as canAccessIframe, } from './helpers/canAccessIframe';
export { default as isWindowTop, } from './html/isWindowTop';
export { default as clickNextGoogleBookPage, } from './helpers/clickNextGoogleBookPage';
export { default as clickPrevGoogleBookPage, } from './helpers/clickPrevGoogleBookPage';
export { default as compareValuesWithMargin, } from './helpers/compareValuesWithMargin';
export { default as getLastNode, } from './html/getLastNode';
export { default as findAvailableIframe, } from './helpers/findAvailableIframe';
/* helpers */
export { default as findWorkingIframe, } from './helpers/findWorkingIframe';
export { default as getIframeDocument, } from './helpers/getIframeDocument';
export { default as getIframesForStore, } from './helpers/getIframesForStore';
export { default as scrollToGoogleDocsPage, } from './helpers/scrollToGoogleDocsPage';
export { default as addClassToElements, } from './html/addClassToElements';
export { default as alterDom, } from './html/alterDom';
export { default as alterNode, } from './html/alterNode';
export { default as alterNodeWord, } from './html/alterNodeWord';
export { default as cleanHtmlText, } from './html/cleanHtmlText';
export * from './html/findNextSibling';
export { default as getElementFromPoint, } from './html/getElementFromPoint';
export { default as getFirstNode, } from './html/getFirstNode';
export { default as getGoogleBookPage, } from './html/getGoogleBookPage';
export { default as getGoogleBookSections, } from './html/getGoogleBookSections';
export { default as getGoogleDocsPageByQuery, } from './html/getGoogleDocsPageByQuery';
export { default as getGoogleDocsPageByScroll, } from './html/getGoogleDocsPageByScroll';
export { default as getGoogleDocsSections, } from './html/getGoogleDocsSections';
export { default as getGoogleDocsSectionsSvg, } from './html/getGoogleDocsSectionsSvg';
export { default as getGoogleFormsSections, } from './html/getGoogleFormsSections';
export { default as getOpenBookSections, } from './html/getOpenBookSections';
export { default as getRectSectionById, } from './html/getRectSectionById';
export { default as getRectSectionsById, } from './html/getRectSectionsById';
export { default as getSectionById, } from './html/getSectionById';
export { default as getSectionsById, } from './html/getSectionsById';
export { default as getSectionWords, } from './html/getSectionWords';
export { default as getSelfIframes, } from './html/getSelfIframes';
export { default as getViewportByDocType, } from './html/getViewportByDocType';
export { default as hasChildNodes, } from './html/hasChildNodes';
export { default as isVisible, } from './html/isVisible';
export { default as isVisibleNode, } from './html/isVisibleNode';
export { default as rectSectionQuerySelector, } from './html/rectSectionQuerySelector';
export { default as removeAllHelperTags, } from './html/removeAllHelperTags';
export { default as removeClassFromAll, } from './html/removeClassFromAll';
export { default as removeHelperTags, } from './html/removeHelperTags';
export { default as cleanupSections, } from './html/cleanupSections';
export { default as removeHTMLSpaces, } from './html/removeHTMLSpaces';
export { default as removeLineBreaks, } from './html/removeLineBreaks';
export { default as removeWordTags, } from './html/removeWordTags';
export { default as replaceLineBreaksWithSpaces, } from './html/replaceLineBreaksWithSpaces';
export { default as sectionQuerySelector, } from './html/sectionQuerySelector';
export { default as setSectionBackground, } from './html/setSectionBackground';
export { default as setWordBackground, } from './html/setWordBackground';
export { default as splitSentencesIntoWords, } from './html/splitSentencesIntoWords';
export { default as trimQuotes, } from './html/trimQuotes';
export * from './html/walkTheDom/util';
/* location */
export { default as getHostnameFromUrl, } from './location/getHostnameFromUrl';
export { default as getParserType, } from './location/getParserType';
export { default as isGoogleBookDocument, } from './location/isGoogleBookDocument';
export { default as isGoogleDocsDocument, } from './location/isGoogleDocsDocument';
export { default as isGoogleDrivePreview, } from './location/isGoogleDrivePreview';
export { default as isGoogleFormsDocument, } from './location/isGoogleFormsDocument';
export { default as isGrammarlyAppHost, } from './location/isGrammarlyAppHost';
export { default as isPdfPage, } from './location/isPdfPage';
/* mp */
export { default as mpToContent, } from './mp';
/* nlp */
export { default as getSentencesFromText, } from './nlp/getSentencesFromText';
export { default as combineSmallSentences, } from './nlp/combineSmallSentences';
/* predicates */
export { default as hasSectionsInAdvance, } from './predicates/hasSectionsInAdvance';
export { default as isElementNode, } from './predicates/isElementNode';
export { default as isError, } from './predicates/isError';
export { default as isGoogleBook, } from './predicates/isGoogleBook';
export { default as isGoogleDocs, } from './predicates/isGoogleDocs';
export { default as isGoogleDocsSvg, } from './predicates/isGoogleDocsSvg';
export { default as isGoogleForm, } from './predicates/isGoogleForm';
export { default as isGoogleUtility, } from './predicates/isGoogleUtility';
export { default as isGrammarlyApp, } from './predicates/isGrammarlyApp';
export { default as isHeading, } from './predicates/isHeading';
export { default as isMaxText, } from './predicates/isMaxText';
export { default as isIframeParsing, } from './predicates/isIframeParsing';
export { default as isLoading, } from './predicates/isLoading';
export { default as isMinText, } from './predicates/isMinText';
export { default as isOverloaded, } from './predicates/isOverloaded';
export { default as isParagraph, } from './predicates/isParagraph';
export { default as isPaused, } from './predicates/isPaused';
export { default as isPlaying, } from './predicates/isPlaying';
export { default as isPlayingOrReady, } from './predicates/isPlayingOrReady';
export { default as isReady, } from './predicates/isReady';
export { default as isSkippableByDesign, } from './predicates/isSkippableByDesign';
export { default as isStopped, } from './predicates/isStopped';
export { default as isTextNode, } from './predicates/isTextNode';
export { default as isNode, } from './predicates/isNode';
export { default as isWaiting, } from './predicates/isWaiting';
export { default as isWikipedia, } from './predicates/isWikipedia';
export { default as isHtmlElement, } from './predicates/isHtmlElement';
export { default as isWindow, } from './predicates/isWindow';

/* string-work */
export { default as getInnerText, } from './string-work/getInnerText';

/* util */
export * from './util/getBrowserAPI';
export { default as getBrowserAPIVoices, } from './voices/getBrowserAPIVoices';
export { default as getCountry, } from './voices/getCountry';
export { default as getCountryCodeFromString, } from './voices/getCountryCodeFromString';
export { default as getEnglishVoiceKey, } from './voices/getEnglishVoiceKey';
/* voices */
export { default as getIsoLang, } from './voices/getIsoLang';
export { default as getIsoLangFromString, } from './voices/getIsoLangFromString';
export { default as getNativeNameFromIsoLang, } from './voices/getNativeNameFromIsoLang';
export { default as getTagsFromCountry, } from './voices/getTagsFromCountry';

export * from './Localization';

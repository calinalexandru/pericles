import { useCallback, } from 'react';
import { useDispatch, } from 'react-redux';

import { VARIABLES, } from '@pericles/constants';
import {
  highlightClearSections,
  highlightClearWords,
  highlightSection as actionHighlightSection,
  setApp,
} from '@pericles/store';
import { mpToContent, } from '@pericles/util';

export default function useAppSettings() {
  const dispatch = useDispatch();

  const setAppSetting = useCallback(
    (key, val) => dispatch(setApp({ [key]: val, })),
    [ dispatch, ]
  );

  const setRoute = useCallback(
    (val) => dispatch(setApp({ [VARIABLES.APP.ROUTE]: val, })),
    [ dispatch, ]
  );

  const setRouteTab = useCallback(
    (val) => dispatch(setApp({ [VARIABLES.APP.ROUTE_TAB]: val, })),
    [ dispatch, ]
  );

  const clearWords = useCallback((tab) => {
    mpToContent(highlightClearWords(), tab);
  }, []);

  const clearSections = useCallback((tab) => {
    mpToContent(highlightClearSections(), tab);
  }, []);

  const highlightSection = useCallback((tab) => {
    mpToContent(actionHighlightSection(), tab);
  }, []);

  return {
    setAppSetting,
    clearWords,
    clearSections,
    highlightSection,
    setRoute,
    setRouteTab,
  };
}

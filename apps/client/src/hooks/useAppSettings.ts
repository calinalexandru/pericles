import { useCallback, } from 'react';
import { useDispatch, } from 'react-redux';

import { VARIABLES, } from '@pericles/constants';
import {
  highlightClearSections,
  highlightClearWords,
  highlightSection as actionHighlightSection,
  appActions,
} from '@pericles/store';
import { mpToContent, } from '@pericles/util';

export default function useAppSettings() {
  const dispatch = useDispatch();

  const setAppSetting = useCallback(
    (key: string, val: number | string | boolean) =>
      dispatch(appActions.set({ [key]: val, })),
    [ dispatch, ]
  );

  const setRoute = useCallback(
    (val: string) => dispatch(appActions.set({ [VARIABLES.APP.ROUTE]: val, })),
    [ dispatch, ]
  );

  const setRouteTab = useCallback(
    (val: string) =>
      dispatch(appActions.set({ [VARIABLES.APP.ROUTE_TAB]: val, })),
    [ dispatch, ]
  );

  const clearWords = useCallback((tab: number) => {
    mpToContent(highlightClearWords(), tab);
  }, []);

  const clearSections = useCallback((tab: number) => {
    mpToContent(highlightClearSections(), tab);
  }, []);

  const highlightSection = useCallback((tab: number) => {
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

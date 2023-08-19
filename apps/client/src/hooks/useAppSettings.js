import { useCallback, } from 'react';
import { useDispatch, } from 'react-redux';

import { VARIABLES, } from '@pericles/constants';
import {
  appActions,
  //   appAutoscrollSelector,
  //   appCreditsSelector,
  //   appHighlightColorSelector,
  //   appHighlightStyleSelector,
  //   appMiniPlayerSelector,
  //   appRouteSelector,
  //   appRouteTabSelector,
  //   appScholarModeSelector,
  //   appSectionTrackerSelector,
  //   appWordTrackerColorSelector,
  //   appWordTrackerSelector,
  //   appWordTrackerStyleSelector,
  //   hotkeysDisableSelector,
} from '@pericles/store';
import { mpToContent, } from '@pericles/util';

const { app, highlight, } = appActions;
export default function useAppSettings() {
  const dispatch = useDispatch();
  // const disableHotkeys = useSelector(hotkeysDisableSelector);
  // const autoscroll = useSelector(appAutoscrollSelector);
  // const wordTracker = useSelector(appWordTrackerSelector);
  // const wordTrackerStyle = useSelector(appWordTrackerStyleSelector);
  // const wordTrackerColor = useSelector(appWordTrackerColorSelector);
  // const sectionTracker = useSelector(appSectionTrackerSelector);
  // const miniPlayer = useSelector(appMiniPlayerSelector);
  // const scholarMode = useSelector(appScholarModeSelector);
  // const credits = useSelector(appCreditsSelector);
  // const highlightColor = useSelector(appHighlightColorSelector);
  // const highlightStyle = useSelector(appHighlightStyleSelector);
  // const route = useSelector(appRouteSelector);
  // const routeTab = useSelector(appRouteTabSelector);
  const setAppSetting = useCallback(
    (key, val) => dispatch(app.set({ [key]: val, })),
    []
  );
  const setRoute = useCallback(
    (val) => dispatch(app.set({ [VARIABLES.APP.ROUTE]: val, })),
    []
  );
  const setRouteTab = useCallback(
    (val) => dispatch(app.set({ [VARIABLES.APP.ROUTE_TAB]: val, })),
    []
  );
  const clearWords = useCallback((tab) => {
    mpToContent(highlight.clearWords(), tab);
  }, []);
  const clearSections = useCallback((tab) => {
    mpToContent(highlight.clearSections(), tab);
  }, []);
  const highlightSection = useCallback((tab) => {
    mpToContent(highlight.section(), tab);
  }, []);

  return {
    setAppSetting,
    clearWords,
    clearSections,
    highlightSection,
    setRoute,
    setRouteTab,
    // scholarMode,
    // route,
    // routeTab,
    // disableHotkeys,
    // autoscroll,
    // wordTracker,
    // wordTrackerStyle,
    // wordTrackerColor,
    // sectionTracker,
    // miniPlayer,
    // highlightColor,
    // highlightStyle,
    // credits,
  };
}

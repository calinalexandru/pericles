import {
  MoreHorizSharp,
  EqualizerSharp,
  AccessibilityNewSharp,
} from '@mui/icons-material';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { Paper, Tab, Tabs, } from '@mui/material';
import React, { useCallback, useMemo, } from 'react';
import { useSelector, } from 'react-redux';

import { TABS, } from '@pericles/constants';
import { appRouteTabSelector, settingsVisibleSelector, } from '@pericles/store';

import useAppSettings from '../hooks/useAppSettings';
import MiscPage from '../pages/MiscPage';

import HotkeysComponent from './Hotkeys';
import SettingsComponent from './Settings/Settings';
import TabPanel from './TabPanel';
import TweaksComponent from './Tweaks';

const tabCSS = { color: 'secondary.dark', };
const paperSx = {
  bgcolor: 'tertiary.dark',
};

export default function FooterComponent() {
  console.log('FooterComopnent.rendering');
  const visible = useSelector(settingsVisibleSelector);
  const routeTab = useSelector(appRouteTabSelector);
  const { setRouteTab, } = useAppSettings();

  const a11yProps = useCallback(
    (index: number) => ({
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }),
    []
  );

  const equalizerIcon = useMemo(() => <EqualizerSharp />, []);
  const displayIcon = useMemo(() => <DisplaySettingsIcon />, []);
  const accesibilityIcon = useMemo(() => <AccessibilityNewSharp />, []);
  const moreIcon = useMemo(() => <MoreHorizSharp />, []);

  return visible ? (
    <>
      <Paper
        elevation={0}
        sx={paperSx}>
        <Tabs
          value={routeTab}
          onChange={(e, val) => {
            setRouteTab(val);
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="pages"
          variant="fullWidth"
        >
          <Tab
            sx={tabCSS}
            icon={equalizerIcon}
            aria-label="Voice"
            {...a11yProps(TABS.SETTINGS)}
          />
          <Tab
            sx={tabCSS}
            icon={displayIcon}
            aria-label="Tweaks"
            {...a11yProps(TABS.TWEAKS)}
          />
          <Tab
            sx={tabCSS}
            icon={accesibilityIcon}
            aria-label="Hotkeys"
            {...a11yProps(TABS.HOTKEYS)}
          />
          <Tab
            sx={tabCSS}
            icon={moreIcon}
            aria-label="Misc"
            {...a11yProps(TABS.MISC)}
          />
        </Tabs>
      </Paper>
      <TabPanel
        value={routeTab}
        index={TABS.SETTINGS}>
        <SettingsComponent />
      </TabPanel>
      <TabPanel
        value={routeTab}
        index={TABS.TWEAKS}>
        <TweaksComponent />
      </TabPanel>
      <TabPanel
        value={routeTab}
        index={TABS.HOTKEYS}>
        <HotkeysComponent />
      </TabPanel>
      <TabPanel
        value={routeTab}
        index={TABS.MISC}>
        <MiscPage />
      </TabPanel>
    </>
  ) : null;
}

/* eslint-disable react/jsx-props-no-spreading */
import {
  MoreHorizSharp,
  EqualizerSharp,
  AccessibilityNewSharp,
} from '@mui/icons-material';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { Paper, Tab, Tabs, } from '@mui/material';
import React from 'react';
import { useSelector, } from 'react-redux';

import HotkeysComponent from '@/components/hotkeys';
import SettingsComponent from '@/components/settings';
import TabPanel from '@/components/tabPanel';
import TweaksComponent from '@/components/tweaks';
import useAppSettings from '@/hooks/useAppSettings';
import MiscPage from '@/pages/MiscPage';
import { TABS, } from '@pericles/constants';
import { appRouteTabSelector, settingsVisibleSelector, } from '@pericles/store';

export default function FooterComponent() {
  console.log('FooterComopnent.rendering');
  const visible = useSelector(settingsVisibleSelector);
  const routeTab = useSelector(appRouteTabSelector);
  const { setRouteTab, } = useAppSettings();
  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  });

  const tabCSS = { color: 'secondary.dark', };
  return visible ? (
    <>
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'tertiary.dark',
        }}
      >
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
            icon={<EqualizerSharp />}
            aria-label="Voice"
            {...a11yProps(TABS.SETTINGS)}
          />
          <Tab
            sx={tabCSS}
            icon={<DisplaySettingsIcon />}
            aria-label="Tweaks"
            {...a11yProps(TABS.TWEAKS)}
          />
          <Tab
            sx={tabCSS}
            icon={<AccessibilityNewSharp />}
            aria-label="Hotkeys"
            {...a11yProps(TABS.HOTKEYS)}
          />
          <Tab
            sx={tabCSS}
            icon={<MoreHorizSharp />}
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

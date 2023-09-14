import FindInPageSharpIcon from '@mui/icons-material/FindInPageSharp';
import KeyboardSharpIcon from '@mui/icons-material/KeyboardSharp';
import RadioSharpIcon from '@mui/icons-material/RadioSharp';
import SubtitlesSharpIcon from '@mui/icons-material/SubtitlesSharp';
import TranslateSharpIcon from '@mui/icons-material/TranslateSharp';
import {
  Switch,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import React, { useEffect, } from 'react';
import { useSelector, } from 'react-redux';

import useAppSettings from '@/hooks/useAppSettings';
import useHotkeysSettings from '@/hooks/useHotkeysSettings';
import ColorPicker from '@/primitives/ColorPicker';
import {
  SECTION_HIGHLIGHT_STYLES,
  VARIABLES,
  WORD_TRACKER_STYLES,
} from '@pericles/constants';
import {
  appAutoscrollSelector,
  appHighlightColorSelector,
  appHighlightStyleSelector,
  appMiniPlayerSelector,
  appSectionTrackerSelector,
  appWordTrackerColorSelector,
  appWordTrackerSelector,
  appWordTrackerStyleSelector,
  hotkeysDisableSelector,
  playerTabSelector,
} from '@pericles/store';
import { t, } from '@pericles/util';

const switchInputProps = { 'aria-label': 'primary checkbox', };
const listSx = { width: '100%', bgcolor: 'background.paper', };
const listItemTextSx = {
  mx: 1,
  fontSize: '0.8rem',
};
const listItemSx = {
  position: 'static',
};

export default function TweaksComponent() {
  const disableHotkeys = useSelector(hotkeysDisableSelector);
  const autoscroll = useSelector(appAutoscrollSelector);
  const wordTracker = useSelector(appWordTrackerSelector);
  const wordTrackerColor = useSelector(appWordTrackerColorSelector);
  const wordTrackerStyle = useSelector(appWordTrackerStyleSelector);
  const sectionTracker = useSelector(appSectionTrackerSelector);
  const miniPlayer = useSelector(appMiniPlayerSelector);
  const highlightColor = useSelector(appHighlightColorSelector);
  const highlightStyle = useSelector(appHighlightStyleSelector);
  const playerTab = useSelector(playerTabSelector);
  const { setAppSetting, clearWords, highlightSection, clearSections, } =
    useAppSettings();
  const { setHotkeysSetting, } = useHotkeysSettings();

  useEffect(() => {
    if (!sectionTracker) clearSections(playerTab);
    else highlightSection(playerTab);
  }, [ clearSections, highlightSection, sectionTracker, playerTab, ]);

  useEffect(() => {
    if (!wordTracker) clearWords(playerTab);
  }, [ wordTracker, clearWords, playerTab, ]);

  console.log('Tweaks', { wordTrackerColor, highlightColor, });

  return (
    <List sx={listSx}>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <FindInPageSharpIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          id="switch-list-label-autoscroll"
          primary={t`auto_scroll_title`}
          secondary={t`auto_scroll_description`}
        />
        <Switch
          edge="end"
          checked={autoscroll}
          color="primary"
          onChange={(e, value) => {
            setAppSetting(VARIABLES.APP.AUTOSCROLL, value);
          }}
          inputProps={switchInputProps}
          value="1"
        />
      </ListItem>
      <Divider />
      <ListItem sx={listItemSx}>
        <ListItemAvatar>
          <Avatar>
            <TranslateSharpIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          id="switch-list-label-word-tracker"
          primary={t`word_tracking_title`}
          secondary={
            <>
              <Select
                size="small"
                variant="standard"
                autoWidth={true}
                value={wordTrackerStyle}
                onChange={(e) => {
                  clearWords(playerTab);
                  setAppSetting(
                    VARIABLES.APP.WORD_TRACKER_STYLE,
                    e.target.value
                  );
                }}
                sx={listItemTextSx}
              >
                {Object.keys(WORD_TRACKER_STYLES).map((style) => (
                  <MenuItem
                    dense={true}
                    divider={true}
                    key={style}
                    value={(WORD_TRACKER_STYLES as any)[style]}
                  >
                    {style.toLocaleLowerCase()}
                  </MenuItem>
                ))}
              </Select>
              <ColorPicker
                value={wordTrackerColor}
                onChange={(val) => {
                  setAppSetting(VARIABLES.APP.WORD_TRACKER_COLOR, val);
                }}
              />
            </>
          }
        />
        <Switch
          edge="end"
          checked={wordTracker}
          color="info"
          onChange={(e, value) => {
            setAppSetting(VARIABLES.APP.WORD_TRACKER, value);
          }}
          inputProps={switchInputProps}
          value="1"
        />
      </ListItem>
      <Divider />
      <ListItem sx={listItemSx}>
        <ListItemAvatar>
          <Avatar>
            <SubtitlesSharpIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          id="switch-list-label-section-tracker"
          primary={t`section_highlight_title`}
          secondary={
            <>
              <Select
                size="small"
                variant="standard"
                autoWidth={true}
                value={highlightStyle}
                onChange={(e) => {
                  clearSections(playerTab);
                  setAppSetting(VARIABLES.APP.HIGHLIGHT_STYLE, e.target.value);
                  highlightSection(playerTab);
                }}
                sx={listItemTextSx}
              >
                {Object.keys(SECTION_HIGHLIGHT_STYLES).map((style) => (
                  <MenuItem
                    dense={true}
                    divider={true}
                    key={style}
                    value={(SECTION_HIGHLIGHT_STYLES as any)[style]}
                  >
                    {style.toLocaleLowerCase()}
                  </MenuItem>
                ))}
              </Select>
              <ColorPicker
                value={highlightColor}
                onChange={(val) => {
                  setAppSetting(VARIABLES.APP.HIGHLIGHT_COLOR, val);
                }}
              />
            </>
          }
        />
        <Switch
          edge="end"
          checked={sectionTracker}
          color="primary"
          onChange={(e, value) => {
            setAppSetting(VARIABLES.APP.SECTION_TRACKER, value);
          }}
          inputProps={switchInputProps}
          value="1"
        />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <RadioSharpIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          id="switch-list-label-mini-player"
          primary={t`inline_player_title`}
          secondary={t`inline_player_description`}
        />
        <Switch
          edge="end"
          checked={miniPlayer}
          color="info"
          onChange={(e, value) => {
            setAppSetting(VARIABLES.APP.MINI_PLAYER, value);
          }}
          inputProps={switchInputProps}
          value="1"
        />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <KeyboardSharpIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          id="switch-list-label-disable-hotkeys"
          primary={t`disable_hotkeys_title`}
          secondary={t`disable_hotkeys_description`}
        />
        <Switch
          edge="end"
          checked={disableHotkeys}
          color="primary"
          onChange={(event, value) => {
            setHotkeysSetting(VARIABLES.HOTKEYS.DISABLE, value);
          }}
          inputProps={switchInputProps}
          value="1"
        />
      </ListItem>
    </List>
  );
}

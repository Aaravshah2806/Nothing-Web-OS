import React from 'react';
import {
  FileText,
  Calculator,
  Sliders,
  Image,
  Disc,
  Terminal,
  Folder,
  Zap,
  Timer,
  Mic,
  Code,
  Sparkles,
  Globe,
  Tv,
  Edit3,
  Share2,
  Bookmark,
} from 'lucide-react';
import NotesApp from './notes/NotesApp';
import CalculatorApp from './calculator/CalculatorApp';
import SettingsApp from './settings/SettingsApp';
import GalleryApp from './gallery/GalleryApp';
import MusicApp from './music/MusicApp';
import TerminalApp from './terminal/TerminalApp';
import FileManagerApp from './files/FileManagerApp';
import GlyphComposerApp from './glyph/GlyphComposerApp';
import PomodoroApp from './pomodoro/PomodoroApp';
import RecorderApp from './recorder/RecorderApp';
import DevToolsApp from './devtools/DevToolsApp';
import AIAssistantApp from './ai/AIAssistantApp';

// Real-Life Web Applications Running Inside In-Page OS Windows
import BrowserApp from './browser/BrowserApp';
import VSCodeApp from './vscode/VSCodeApp';
import SpotifyApp from './spotify/SpotifyApp';
import YouTubeApp from './youtube/YouTubeApp';
import GitHubApp from './github/GitHubApp';
import WhiteboardApp from './whiteboard/WhiteboardApp';
import RedditApp from './reddit/RedditApp';

export const APP_REGISTRY = {
  browser: {
    id: 'browser',
    name: 'NOTHING WEB',
    icon: Globe,
    imageIcon: '/icons/nthing/chrome.png',
    component: BrowserApp,
    defaultWidth: 880,
    defaultHeight: 580,
    pinned: true,
  },
  vscode: {
    id: 'vscode',
    name: 'VS CODE',
    icon: Code,
    imageIcon: '/icons/nthing/vsc.png',
    component: VSCodeApp,
    defaultWidth: 920,
    defaultHeight: 620,
    pinned: true,
  },
  spotify: {
    id: 'spotify',
    name: 'SPOTIFY',
    icon: Disc,
    imageIcon: '/icons/nthing/spotify.png',
    component: SpotifyApp,
    defaultWidth: 460,
    defaultHeight: 620,
    pinned: true,
  },
  youtube: {
    id: 'youtube',
    name: 'YOUTUBE',
    icon: Tv,
    imageIcon: '/icons/nthing/youtube.png',
    component: YouTubeApp,
    defaultWidth: 840,
    defaultHeight: 520,
    pinned: true,
  },
  github: {
    id: 'github',
    name: 'GITHUB',
    icon: Globe,
    imageIcon: '/icons/nthing/github.png',
    component: GitHubApp,
    defaultWidth: 900,
    defaultHeight: 580,
    pinned: true,
  },
  whiteboard: {
    id: 'whiteboard',
    name: 'WHITEBOARD',
    icon: Edit3,
    imageIcon: '/icons/nthing/ps.png',
    component: WhiteboardApp,
    defaultWidth: 880,
    defaultHeight: 580,
    pinned: true,
  },
  assistant: {
    id: 'assistant',
    name: 'GLYPH AI',
    icon: Sparkles,
    imageIcon: '/icons/nthing/gemini.png',
    component: AIAssistantApp,
    defaultWidth: 540,
    defaultHeight: 580,
    pinned: true,
  },
  notes: {
    id: 'notes',
    name: 'NOTES',
    icon: FileText,
    imageIcon: '/icons/nthing/notepad.png',
    component: NotesApp,
    defaultWidth: 640,
    defaultHeight: 460,
    pinned: true,
  },
  files: {
    id: 'files',
    name: 'FILES',
    icon: Folder,
    imageIcon: '/icons/nthing/explorer.png',
    component: FileManagerApp,
    defaultWidth: 680,
    defaultHeight: 480,
    pinned: true,
  },
  terminal: {
    id: 'terminal',
    name: 'TERMINAL',
    icon: Terminal,
    imageIcon: '/icons/nthing/cmd.png',
    component: TerminalApp,
    defaultWidth: 640,
    defaultHeight: 420,
    pinned: true,
  },
  glyph: {
    id: 'glyph',
    name: 'GLYPH LAB',
    icon: Zap,
    imageIcon: '/icons/nthing/widgets1.png',
    component: GlyphComposerApp,
    defaultWidth: 680,
    defaultHeight: 520,
    pinned: false,
  },
  music: {
    id: 'music',
    name: 'SYNTH AUDIO',
    icon: Disc,
    imageIcon: '/icons/nthing/widgets4.png',
    component: MusicApp,
    defaultWidth: 440,
    defaultHeight: 540,
    pinned: false,
  },
  pomodoro: {
    id: 'pomodoro',
    name: 'FOCUS TIMER',
    icon: Timer,
    imageIcon: '/icons/nthing/widgets3.png',
    component: PomodoroApp,
    defaultWidth: 440,
    defaultHeight: 520,
    pinned: false,
  },
  recorder: {
    id: 'recorder',
    name: 'RECORDER',
    icon: Mic,
    imageIcon: '/icons/nthing/widgets2.png',
    component: RecorderApp,
    defaultWidth: 480,
    defaultHeight: 520,
    pinned: false,
  },
  devtools: {
    id: 'devtools',
    name: 'DEV TOOLS',
    icon: Code,
    imageIcon: '/icons/nthing/sublime.png',
    component: DevToolsApp,
    defaultWidth: 680,
    defaultHeight: 480,
    pinned: false,
  },
  calculator: {
    id: 'calculator',
    name: 'CALCULATOR',
    icon: Calculator,
    imageIcon: '/icons/nthing/calc.png',
    component: CalculatorApp,
    defaultWidth: 320,
    defaultHeight: 460,
    pinned: false,
  },
  gallery: {
    id: 'gallery',
    name: 'GALLERY',
    icon: Image,
    imageIcon: '/icons/menu/gallery.png',
    component: GalleryApp,
    defaultWidth: 640,
    defaultHeight: 480,
    pinned: false,
  },
  figma: {
    id: 'figma',
    name: 'FIGMA',
    icon: Sparkles,
    imageIcon: '/icons/nthing/figma.png',
    component: (props) =>
      React.createElement(BrowserApp, {
        initialUrl: 'https://www.figma.com/embed?embed_host=astra&url=https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
        ...props,
      }),
    defaultWidth: 880,
    defaultHeight: 580,
    pinned: false,
  },
  discord: {
    id: 'discord',
    name: 'DISCORD',
    icon: Sparkles,
    imageIcon: '/icons/nthing/discord.png',
    component: (props) =>
      React.createElement(BrowserApp, {
        initialUrl: 'https://discord.com/app',
        ...props,
      }),
    defaultWidth: 820,
    defaultHeight: 560,
    pinned: false,
  },
  reddit: {
    id: 'reddit',
    name: 'REDDIT',
    icon: Bookmark,
    imageIcon: '/icons/nthing/reddit.png',
    component: RedditApp,
    defaultWidth: 840,
    defaultHeight: 580,
    pinned: true,
  },
  settings: {
    id: 'settings',
    name: 'SETTINGS',
    icon: Sliders,
    imageIcon: '/icons/nthing/Settings.png',
    component: SettingsApp,
    defaultWidth: 680,
    defaultHeight: 500,
    pinned: true,
  },
};

export const getAppList = () => Object.values(APP_REGISTRY);

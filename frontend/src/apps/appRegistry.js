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

export const APP_REGISTRY = {
  glyph: {
    id: 'glyph',
    name: 'GLYPH LAB',
    icon: Zap,
    component: GlyphComposerApp,
    defaultWidth: 680,
    defaultHeight: 520,
    pinned: true,
  },
  notes: {
    id: 'notes',
    name: 'NOTES',
    icon: FileText,
    component: NotesApp,
    defaultWidth: 640,
    defaultHeight: 460,
    pinned: true,
  },
  pomodoro: {
    id: 'pomodoro',
    name: 'FOCUS TIMER',
    icon: Timer,
    component: PomodoroApp,
    defaultWidth: 440,
    defaultHeight: 520,
    pinned: true,
  },
  music: {
    id: 'music',
    name: 'MUSIC',
    icon: Disc,
    component: MusicApp,
    defaultWidth: 440,
    defaultHeight: 540,
    pinned: true,
  },
  recorder: {
    id: 'recorder',
    name: 'RECORDER',
    icon: Mic,
    component: RecorderApp,
    defaultWidth: 480,
    defaultHeight: 520,
    pinned: true,
  },
  devtools: {
    id: 'devtools',
    name: 'DEV TOOLS',
    icon: Code,
    component: DevToolsApp,
    defaultWidth: 680,
    defaultHeight: 480,
    pinned: true,
  },
  files: {
    id: 'files',
    name: 'FILES',
    icon: Folder,
    component: FileManagerApp,
    defaultWidth: 680,
    defaultHeight: 480,
    pinned: true,
  },
  calculator: {
    id: 'calculator',
    name: 'CALCULATOR',
    icon: Calculator,
    component: CalculatorApp,
    defaultWidth: 320,
    defaultHeight: 460,
    pinned: true,
  },
  terminal: {
    id: 'terminal',
    name: 'TERMINAL',
    icon: Terminal,
    component: TerminalApp,
    defaultWidth: 640,
    defaultHeight: 420,
    pinned: true,
  },
  gallery: {
    id: 'gallery',
    name: 'GALLERY',
    icon: Image,
    component: GalleryApp,
    defaultWidth: 640,
    defaultHeight: 480,
    pinned: true,
  },
  settings: {
    id: 'settings',
    name: 'SETTINGS',
    icon: Sliders,
    component: SettingsApp,
    defaultWidth: 680,
    defaultHeight: 500,
    pinned: true,
  },
};

export const getAppList = () => Object.values(APP_REGISTRY);

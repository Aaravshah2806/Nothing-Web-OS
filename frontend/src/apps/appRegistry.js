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

export const APP_REGISTRY = {
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
  glyph: {
    id: 'glyph',
    name: 'GLYPH LAB',
    icon: Zap,
    imageIcon: '/icons/nthing/widgets1.png',
    component: GlyphComposerApp,
    defaultWidth: 680,
    defaultHeight: 520,
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
  pomodoro: {
    id: 'pomodoro',
    name: 'FOCUS TIMER',
    icon: Timer,
    imageIcon: '/icons/nthing/widgets3.png',
    component: PomodoroApp,
    defaultWidth: 440,
    defaultHeight: 520,
    pinned: true,
  },
  music: {
    id: 'music',
    name: 'MUSIC',
    icon: Disc,
    imageIcon: '/icons/nthing/spotify.png',
    component: MusicApp,
    defaultWidth: 440,
    defaultHeight: 540,
    pinned: true,
  },
  recorder: {
    id: 'recorder',
    name: 'RECORDER',
    icon: Mic,
    imageIcon: '/icons/nthing/widgets2.png',
    component: RecorderApp,
    defaultWidth: 480,
    defaultHeight: 520,
    pinned: true,
  },
  devtools: {
    id: 'devtools',
    name: 'DEV TOOLS',
    icon: Code,
    imageIcon: '/icons/nthing/vsc.png',
    component: DevToolsApp,
    defaultWidth: 680,
    defaultHeight: 480,
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
  calculator: {
    id: 'calculator',
    name: 'CALCULATOR',
    icon: Calculator,
    imageIcon: '/icons/nthing/calc.png',
    component: CalculatorApp,
    defaultWidth: 320,
    defaultHeight: 460,
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
  gallery: {
    id: 'gallery',
    name: 'GALLERY',
    icon: Image,
    imageIcon: '/icons/menu/gallery.png',
    component: GalleryApp,
    defaultWidth: 640,
    defaultHeight: 480,
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

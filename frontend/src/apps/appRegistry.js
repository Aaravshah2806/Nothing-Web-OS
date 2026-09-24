import { FileText, Calculator, Sliders, Image, Disc, Terminal, Folder } from 'lucide-react';
import NotesApp from './notes/NotesApp';
import CalculatorApp from './calculator/CalculatorApp';
import SettingsApp from './settings/SettingsApp';
import GalleryApp from './gallery/GalleryApp';
import MusicApp from './music/MusicApp';
import TerminalApp from './terminal/TerminalApp';
import FileManagerApp from './files/FileManagerApp';

export const APP_REGISTRY = {
  notes: {
    id: 'notes',
    name: 'NOTES',
    icon: FileText,
    component: NotesApp,
    defaultWidth: 620,
    defaultHeight: 440,
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
  files: {
    id: 'files',
    name: 'FILES',
    icon: Folder,
    component: FileManagerApp,
    defaultWidth: 680,
    defaultHeight: 480,
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
  music: {
    id: 'music',
    name: 'MUSIC',
    icon: Disc,
    component: MusicApp,
    defaultWidth: 420,
    defaultHeight: 520,
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

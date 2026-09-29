import ClockWidget from './clock/ClockWidget';
import DateWidget from './date/DateWidget';
import WeatherWidget from './weather/WeatherWidget';
import SystemMonitorWidget from './monitor/SystemMonitorWidget';
import MusicWidget from './music/MusicWidget';
import QuotesWidget from './quotes/QuotesWidget';
import GlyphWidget from './glyph-status/GlyphWidget';
import NotesWidget from './notes/NotesWidget';
import CalendarWidget from './calendar/CalendarWidget';

export const WIDGET_REGISTRY = {
  clock: {
    id: 'clock',
    name: 'NThing Dual-Tone Clock',
    component: ClockWidget,
    defaultSize: { w: 2, h: 1 },
  },
  date: {
    id: 'date',
    name: 'NThing Date 2 Pill',
    component: DateWidget,
    defaultSize: { w: 2, h: 1 },
  },
  weather: {
    id: 'weather',
    name: 'NThing Weather 2 Pill',
    component: WeatherWidget,
    defaultSize: { w: 2, h: 1 },
  },
  'system-ram': {
    id: 'system-ram',
    name: 'NThing Monitor (RAM/CPU/SSD)',
    component: SystemMonitorWidget,
    defaultSize: { w: 2, h: 1 },
  },
  'music-widget': {
    id: 'music-widget',
    name: 'NThing Music Player Pill',
    component: MusicWidget,
    defaultSize: { w: 3, h: 1 },
  },
  quotes: {
    id: 'quotes',
    name: 'NThing Thoughts & Quotes',
    component: QuotesWidget,
    defaultSize: { w: 2, h: 1 },
  },
  'glyph-status': {
    id: 'glyph-status',
    name: 'Glyph LED Interface',
    component: GlyphWidget,
    defaultSize: { w: 2, h: 1 },
  },
  'notes-widget': {
    id: 'notes-widget',
    name: 'Desktop Sticky Note',
    component: NotesWidget,
    defaultSize: { w: 2, h: 2 },
  },
  calendar: {
    id: 'calendar',
    name: 'Month Calendar',
    component: CalendarWidget,
    defaultSize: { w: 2, h: 2 },
  },
};

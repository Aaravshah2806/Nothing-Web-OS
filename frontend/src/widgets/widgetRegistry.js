import ClockWidget from './clock/ClockWidget';
import GlyphWidget from './glyph-status/GlyphWidget';
import NotesWidget from './notes/NotesWidget';
import CalendarWidget from './calendar/CalendarWidget';
import WeatherWidget from './weather/WeatherWidget';

export const WIDGET_REGISTRY = {
  clock: {
    id: 'clock',
    name: 'Digital Clock',
    component: ClockWidget,
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
    name: 'Quick Note',
    component: NotesWidget,
    defaultSize: { w: 2, h: 2 },
  },
  calendar: {
    id: 'calendar',
    name: 'Calendar',
    component: CalendarWidget,
    defaultSize: { w: 2, h: 2 },
  },
  weather: {
    id: 'weather',
    name: 'Weather',
    component: WeatherWidget,
    defaultSize: { w: 2, h: 1 },
  },
};

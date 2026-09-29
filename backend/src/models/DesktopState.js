import mongoose from 'mongoose';

const desktopStateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    activeWidgets: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        { id: 'glyph-status', x: 24, y: 32, size: '2x2' },
        { id: 'weather', x: 380, y: 32, size: '2x1' },
        { id: 'quick-notes', x: 380, y: 220, size: '2x2' },
      ],
    },
    desktopIcons: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark',
    },
    wallpaper: {
      type: String,
      default: 'circuit',
    },
    accentColor: {
      type: String,
      default: '#FF3B30',
    },
    masterVolume: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
    isMuted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const DesktopState = mongoose.model('DesktopState', desktopStateSchema);

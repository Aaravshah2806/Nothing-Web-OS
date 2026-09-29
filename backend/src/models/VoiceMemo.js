import mongoose from 'mongoose';

const voiceMemoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Voice memo title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    duration: {
      type: String,
      default: '00:00',
    },
    audioData: {
      type: String,
      required: [true, 'Audio recording data is required'],
    },
    size: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: 'audio/webm',
    },
  },
  {
    timestamps: true,
  }
);

export const VoiceMemo = mongoose.model('VoiceMemo', voiceMemoSchema);

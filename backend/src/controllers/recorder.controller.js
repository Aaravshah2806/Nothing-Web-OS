import { VoiceMemo } from '../models/VoiceMemo.js';

export const getMemos = async (req, res, next) => {
  try {
    const memos = await VoiceMemo.find({ userId: req.user._id })
      .select('-audioData') // Omit full audio blob in index list for high performance
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: memos.length,
      data: memos,
    });
  } catch (error) {
    next(error);
  }
};

export const getMemoAudio = async (req, res, next) => {
  try {
    const { id } = req.params;

    const memo = await VoiceMemo.findOne({ _id: id, userId: req.user._id });

    if (!memo) {
      return res.status(404).json({
        success: false,
        message: 'Voice memo not found',
      });
    }

    res.status(200).json({
      success: true,
      data: memo,
    });
  } catch (error) {
    next(error);
  }
};

export const saveMemo = async (req, res, next) => {
  try {
    const { title, duration, audioData, size, mimeType } = req.body;

    if (!audioData) {
      return res.status(400).json({
        success: false,
        message: 'audioData base64 payload is required',
      });
    }

    const memo = await VoiceMemo.create({
      userId: req.user._id,
      title: title || `REC_${Date.now().toString().slice(-6)}`,
      duration: duration || '00:00',
      audioData,
      size: size || 0,
      mimeType: mimeType || 'audio/webm',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: memo._id,
        title: memo.title,
        duration: memo.duration,
        size: memo.size,
        mimeType: memo.mimeType,
        createdAt: memo.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMemo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const memo = await VoiceMemo.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!memo) {
      return res.status(404).json({
        success: false,
        message: 'Voice memo not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Voice memo deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

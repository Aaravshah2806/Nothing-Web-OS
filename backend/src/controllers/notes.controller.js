import crypto from 'crypto';
import { Note } from '../models/Note.js';

export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({
      isPinned: -1,
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const { title, content, isPinned, tags } = req.body;

    const note = await Note.create({
      userId: req.user._id,
      title: title || 'Untitled Note',
      content: content || '',
      isPinned: Boolean(isPinned),
      tags: Array.isArray(tags) ? tags : [],
    });

    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, isPinned, tags } = req.body;

    const note = await Note.findOne({ _id: id, userId: req.user._id });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (tags !== undefined) note.tags = tags;

    await note.save();

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const toggleShareNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ _id: id, userId: req.user._id });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    note.isPublic = !note.isPublic;

    if (note.isPublic && !note.shareSlug) {
      note.shareSlug = crypto.randomBytes(6).toString('hex');
    }

    await note.save();

    res.status(200).json({
      success: true,
      isPublic: note.isPublic,
      shareSlug: note.shareSlug,
      shareUrl: note.isPublic ? `/shared/${note.shareSlug}` : null,
    });
  } catch (error) {
    next(error);
  }
};

export const getSharedNote = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const note = await Note.findOne({ shareSlug: slug, isPublic: true })
      .populate('userId', 'username avatar')
      .select('title content updatedAt createdAt userId');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Shared note not found or access revoked',
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

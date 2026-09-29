import { DesktopState } from '../models/DesktopState.js';

export const getDesktopState = async (req, res, next) => {
  try {
    let state = await DesktopState.findOne({ userId: req.user._id });

    if (!state) {
      state = await DesktopState.create({
        userId: req.user._id,
      });
    }

    res.status(200).json({
      success: true,
      data: state,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDesktopState = async (req, res, next) => {
  try {
    const {
      activeWidgets,
      desktopIcons,
      theme,
      wallpaper,
      accentColor,
      masterVolume,
      isMuted,
    } = req.body;

    const updateFields = {};
    if (activeWidgets !== undefined) updateFields.activeWidgets = activeWidgets;
    if (desktopIcons !== undefined) updateFields.desktopIcons = desktopIcons;
    if (theme !== undefined) updateFields.theme = theme;
    if (wallpaper !== undefined) updateFields.wallpaper = wallpaper;
    if (accentColor !== undefined) updateFields.accentColor = accentColor;
    if (masterVolume !== undefined) updateFields.masterVolume = masterVolume;
    if (isMuted !== undefined) updateFields.isMuted = isMuted;

    const state = await DesktopState.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateFields },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: state,
    });
  } catch (error) {
    next(error);
  }
};

import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { DesktopState } from '../models/DesktopState.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'glyph_os_super_secret_jwt_key_2026_nothing_dot_matrix',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password',
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already in use',
      });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password,
    });

    // Create default desktop state for user
    await DesktopState.create({
      userId: user._id,
      activeWidgets: [
        { id: 'glyph-status', x: 24, y: 32, size: '2x2' },
        { id: 'weather', x: 380, y: 32, size: '2x1' },
        { id: 'quick-notes', x: 380, y: 220, size: '2x2' },
      ],
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
};

import { getDBStatus } from '../config/db.js';

export const requireDB = (req, res, next) => {
  if (!getDBStatus()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB is not connected. Please start your local MongoDB or configure MONGODB_URI in backend/.env',
      code: 'DB_DISCONNECTED',
      help: 'https://www.mongodb.com/cloud/atlas',
    });
  }
  next();
};

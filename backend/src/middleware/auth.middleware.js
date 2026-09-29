import { supabase } from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required: missing Bearer token' });
  }

  const token = authHeader.split(' ')[1];

  if (!supabase) {
    // If Supabase not yet configured, allow request in mock/guest mode
    req.user = { id: 'guest-user', email: 'guest@nothing.tech' };
    return next();
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired session token' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Authentication failed', error: err.message });
  }
};

// Alias protect for existing route compatibility
export const protect = requireAuth;

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ') || !supabase) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const { data: { user } } = await supabase.auth.getUser(token);
    req.user = user || null;
  } catch {
    req.user = null;
  }

  next();
};

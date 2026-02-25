import logger from '../utils/logger.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);
  req.token = token;
  req.userId = extractUserIdFromToken(token);
  
  next();
};

const extractUserIdFromToken = (token) => {
  try {
    // PocketBase tokens are JWT format
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload.id || payload.sub;
  } catch (err) {
    logger.debug('Token parsing error:', err.message);
    return null;
  }
};

export default authMiddleware;
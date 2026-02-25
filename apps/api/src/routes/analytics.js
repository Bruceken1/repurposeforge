import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { generateMockAnalytics } from '../utils/mock-data.js';

const router = express.Router();

// GET /analytics - Get mock analytics data
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const analytics = generateMockAnalytics();

  res.json(analytics);
});

export default router;
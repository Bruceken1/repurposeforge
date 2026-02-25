import express from 'express';
import authMiddleware from '../middleware/auth.js';
import pb from '../utils/pocketbase.js';

const router = express.Router();

const tierLimits = {
  free: 5,
  pro: 50,
  enterprise: 500,
};

// GET /usage - Get current user's usage
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const user = await pb.collection('users').getOne(userId);

  const tier = user.tier || 'free';
  const limit = tierLimits[tier] || 5;
  const used = user.daily_usage_count || 0;

  res.json({
    used,
    limit,
    tier,
    remaining: Math.max(0, limit - used),
  });
});

export default router;
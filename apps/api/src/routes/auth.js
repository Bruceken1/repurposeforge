import express from 'express';
import axios from 'axios';
import pb from '../utils/pocketbase.js';
import { validateEmail, validatePassword, validateName } from '../utils/validators.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /auth/google - Google OAuth callback
router.post('/google', async (req, res) => {
  const { code, redirectUri } = req.body;

  if (!code || !redirectUri) {
    return res.status(400).json({ error: 'Missing code or redirectUri' });
  }

  try {
    // Exchange code for Google token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenResponse.data;

    // Get user info from Google
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name, picture } = userInfoResponse.data;

    // Check if user exists in PocketBase
    let user;
    try {
      user = await pb.collection('users').getFirstListItem(`email="${email}"`);
      // Update user
      user = await pb.collection('users').update(user.id, {
        name,
        avatar: picture,
        last_login: new Date().toISOString(),
      });
    } catch (err) {
      // User doesn't exist, create new user
      user = await pb.collection('users').create({
        email,
        name,
        avatar: picture,
        password: Math.random().toString(36).slice(-12),
        passwordConfirm: Math.random().toString(36).slice(-12),
        verified: true,
        tier: 'free',
        daily_usage_count: 0,
      });
    }

    // Authenticate with PocketBase
    const authData = await pb.collection('users').authWithPassword(email, user.password);

    res.json({
      token: authData.token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        tier: user.tier,
      },
    });
  } catch (error) {
    logger.error('Google OAuth error:', error.message);
    throw new Error(`Google OAuth failed: ${error.message}`);
  }
});

// POST /auth/signup - Create new user
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing email, password, or name' });
  }

  validateEmail(email);
  validatePassword(password);
  validateName(name);

  // Check if user already exists
  try {
    await pb.collection('users').getFirstListItem(`email="${email}"`);
    throw new Error('User with this email already exists');
  } catch (err) {
    if (err.message === 'User with this email already exists') {
      throw err;
    }
    // User doesn't exist, continue
  }

  const user = await pb.collection('users').create({
    email,
    password,
    passwordConfirm: password,
    name,
    verified: false,
    tier: 'free',
    daily_usage_count: 0,
  });

  const authData = await pb.collection('users').authWithPassword(email, password);

  res.json({
    token: authData.token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier,
    },
  });
});

// POST /auth/login - Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const authData = await pb.collection('users').authWithPassword(email, password);

  res.json({
    token: authData.token,
    user: {
      id: authData.record.id,
      email: authData.record.email,
      name: authData.record.name,
      tier: authData.record.tier,
    },
  });
});

export default router;
import PocketBase from 'pocketbase';
import logger from './logger.js';

const pb = new PocketBase(process.env.POCKETBASE_URL);

// Initialize admin auth
await pb.admins.authWithPassword(
  process.env.POCKETBASE_ADMIN_EMAIL,
  process.env.POCKETBASE_ADMIN_PASSWORD
).catch((err) => {
  logger.warn('PocketBase admin auth failed:', err.message);
});

export default pb;
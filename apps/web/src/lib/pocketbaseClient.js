import PocketBase from 'pocketbase';

const pb = new PocketBase(
  import.meta.env.VITE_POCKETBASE_URL || 
  'https://your-pocketbase-domain.railway.app'   // ← we will update this after PocketBase is live
);

export default pb;

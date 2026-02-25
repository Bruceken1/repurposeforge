import express from 'express';
import authMiddleware from '../middleware/auth.js';
import pb from '../utils/pocketbase.js';
import { generateMockTranscript, generateMockAssets } from '../utils/mock-data.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /projects - Create new project
router.post('/', authMiddleware, async (req, res) => {
  const { title, source_url, source_file, transcript } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!title) {
    return res.status(400).json({ error: 'Missing title' });
  }

  const project = await pb.collection('projects').create({
    user_id: userId,
    title,
    source_url: source_url || '',
    source_file: source_file || '',
    transcript: transcript || '',
    status: 'created',
    created_at: new Date().toISOString(),
  });

  res.json({
    id: project.id,
    title: project.title,
    status: project.status,
    created_at: project.created_at,
  });
});

// GET /projects - List all projects for authenticated user
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const projects = await pb.collection('projects').getList(1, 50, {
    filter: `user_id="${userId}"`,
    sort: '-created_at',
  });

  res.json(projects.items);
});

// POST /projects/:id/upload - Upload file or URL
router.post('/:id/upload', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { fileUrl, fileSize } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  // Validate file size (max 500MB)
  const maxSize = 500 * 1024 * 1024;
  if (fileSize && fileSize > maxSize) {
    return res.status(400).json({ error: 'File size exceeds 500MB limit' });
  }

  // Verify project exists and belongs to user
  const project = await pb.collection('projects').getOne(id);
  if (project.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // Mock fetch for URL or store file
  const mockTranscript = generateMockTranscript();

  // Update project with transcript
  await pb.collection('projects').update(id, {
    transcript: mockTranscript,
    status: 'uploaded',
  });

  res.json({
    projectId: id,
    status: 'processing',
  });
});

// POST /projects/:id/process - Process project (mock)
router.post('/:id/process', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  // Verify project exists and belongs to user
  const project = await pb.collection('projects').getOne(id);
  if (project.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // Mock processing with delay
  const delay = Math.random() * 2000 + 3000; // 3-5 seconds
  await new Promise(resolve => setTimeout(resolve, delay));

  // Generate mock assets
  const mockAssets = generateMockAssets(id);

  // Update project status
  await pb.collection('projects').update(id, {
    status: 'processed',
  });

  res.json({
    status: 'complete',
    assets: mockAssets,
  });
});

// GET /projects/:id/assets - Get all assets for project
router.get('/:id/assets', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  // Verify project exists and belongs to user
  const project = await pb.collection('projects').getOne(id);
  if (project.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const assets = await pb.collection('assets').getList(1, 500, {
    filter: `project_id="${id}"`,
  });

  res.json(assets.items);
});

// POST /projects/:id/forge-all - Generate all asset types
router.post('/:id/forge-all', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  // Verify project exists and belongs to user
  const project = await pb.collection('projects').getOne(id);
  if (project.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // Mock full pipeline
  const delay = Math.random() * 2000 + 3000;
  await new Promise(resolve => setTimeout(resolve, delay));

  const mockAssets = generateMockAssets(id);
  const assetTypes = Object.keys(mockAssets);
  let assetCount = 0;

  // Create records in PocketBase for each asset type
  for (const assetType of assetTypes) {
    const assets = mockAssets[assetType];
    if (Array.isArray(assets)) {
      for (const asset of assets) {
        await pb.collection('assets').create({
          project_id: id,
          type: assetType,
          data: JSON.stringify(asset),
          created_at: new Date().toISOString(),
        });
        assetCount++;
      }
    }
  }

  // Update project status
  await pb.collection('projects').update(id, {
    status: 'forged',
  });

  res.json({
    status: 'complete',
    assetCount,
  });
});

// POST /projects/:id/export - Export assets
router.post('/:id/export', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { exportType } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!exportType) {
    return res.status(400).json({ error: 'Missing exportType' });
  }

  // Verify project exists and belongs to user
  const project = await pb.collection('projects').getOne(id);
  if (project.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (exportType === 'zip') {
    res.json({
      downloadUrl: 'mock-download-url',
      status: 'ready',
    });
  } else if (exportType === 'clipboard') {
    res.json({
      status: 'copied',
    });
  } else if (exportType === 'whatsapp' || exportType === 'buffer') {
    res.json({
      status: 'ready',
    });
  } else {
    return res.status(400).json({ error: 'Invalid exportType' });
  }
});

export default router;
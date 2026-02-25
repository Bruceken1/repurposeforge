import { Router } from 'express';
import healthCheck from './health-check.js';
import authRouter from './auth.js';
import projectsRouter from './projects.js';
import stripeRouter from './stripe.js';
import usageRouter from './usage.js';
import voiceCloneRouter from './voice-clone.js';
import analyticsRouter from './analytics.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/auth', authRouter);
    router.use('/projects', projectsRouter);
    router.use('/stripe', stripeRouter);
    router.use('/usage', usageRouter);
    router.use('/voice-clone', voiceCloneRouter);
    router.use('/analytics', analyticsRouter);

    return router;
};
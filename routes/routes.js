import express from 'express';
import NewsRoutes from './NewsRoutes';
import UserRoutes from './UserRoutes';

const router = express.Router();

router.use('/news', NewsRoutes);
router.use('/users', UserRoutes);

export default router;

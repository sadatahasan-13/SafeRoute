import express from 'express';
import {
  getRoutes,
  getRouteAnalytics,
  getDashboardData,
  createRoute,
  getRouteById,
  updateRouteStatus,
  deleteRoute,
} from '../controllers/routeController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Specific routes first to prevent :id conflict
router.get('/analytics', getRouteAnalytics);
router.get('/dashboard', getDashboardData);

// Collection routes
router.route('/')
  .get(getRoutes)
  .post(optionalAuth, createRoute);

// Single route operations
router.route('/:id')
  .get(getRouteById)
  .put(updateRouteStatus)
  .delete(deleteRoute);

export default router;


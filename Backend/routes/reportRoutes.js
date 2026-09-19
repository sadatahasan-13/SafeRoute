import express from 'express';
import {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getReports)
  .post(upload.single('image'), createReport);

router.route('/:id')
  .get(getReportById)
  .put(updateReport)
  .delete(deleteReport);

export default router;


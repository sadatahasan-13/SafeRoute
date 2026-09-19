import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getContacts,
  addContact,
  deleteContact,
  updateContact,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// User profile routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Emergency contacts routes
router.route('/contacts')
  .get(protect, getContacts)
  .post(protect, addContact);

router.route('/contacts/:id')
  .put(protect, updateContact)
  .delete(protect, deleteContact);

export default router;


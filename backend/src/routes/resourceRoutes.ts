import express from 'express';
import { getResources, getResourceById, createResource, updateResource } from '../controllers/resourceController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/').get(getResources).post(protect, createResource);
router.route('/:id').get(getResourceById).put(protect, updateResource);

export default router;

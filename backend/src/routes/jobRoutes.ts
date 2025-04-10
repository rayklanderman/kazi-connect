import express from 'express';
import { getJobs, getJobById, createJob, updateJob } from '../controllers/jobController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/').get(getJobs).post(protect, createJob);
router.route('/:id').get(getJobById).put(protect, updateJob);

export default router;

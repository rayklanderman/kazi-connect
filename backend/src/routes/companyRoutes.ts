import express from 'express';
import { getCompanies, getCompanyById, createCompany, updateCompany } from '../controllers/companyController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/').get(getCompanies).post(protect, createCompany);
router.route('/:id').get(getCompanyById).put(protect, updateCompany);

export default router;

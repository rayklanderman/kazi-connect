import { Request, Response } from 'express';
import Company from '../models/Company';

interface MongoError extends Error {
  code?: number;
}

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
export const getCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const company = await Company.findById(req.params.id);
    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a company
// @route   POST /api/companies
// @access  Private/Admin
export const createCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error: unknown) {
    if ((error as MongoError).code === 11000) {
      res.status(400).json({ message: 'Company already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// @desc    Update a company
// @route   PUT /api/companies/:id
// @access  Private/Admin
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error: unknown) {
    if ((error as MongoError).code === 11000) {
      res.status(400).json({ message: 'Company name already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

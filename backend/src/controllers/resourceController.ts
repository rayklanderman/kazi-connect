import { Request, Response } from 'express';
import Resource from '../models/Resource';

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
export const getResources = async (req: Request, res: Response) => {
  try {
    const { type, tags } = req.query;
    let query = {};

    if (type) {
      query = { ...query, type };
    }

    if (tags) {
      query = { ...query, tags: { $in: Array.isArray(tags) ? tags : [tags] } };
    }

    const resources = await Resource.find(query);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
export const getResourceById = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private
export const createResource = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private
export const updateResource = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

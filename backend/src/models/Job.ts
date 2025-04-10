import mongoose from 'mongoose';

interface IJob extends mongoose.Document {
  title: string;
  company: mongoose.Types.ObjectId;
  description: string;
  requirements: string[];
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'active' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [{
    type: String,
  }],
  location: {
    type: String,
    required: true,
  },
  salary: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active',
  },
}, {
  timestamps: true,
});

const Job = mongoose.model<IJob>('Job', jobSchema);

export default Job;

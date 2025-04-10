import mongoose from 'mongoose';

interface ICompany extends mongoose.Document {
  name: string;
  description: string;
  logo: string;
  website: string;
  industry: string;
  size: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  website: {
    type: String,
  },
  industry: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Company = mongoose.model<ICompany>('Company', companySchema);

export default Company;

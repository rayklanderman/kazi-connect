import mongoose from 'mongoose';

interface IResource extends mongoose.Document {
  title: string;
  description: string;
  type: 'article' | 'video' | 'course' | 'book' | 'tool';
  url: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['article', 'video', 'course', 'book', 'tool'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
}, {
  timestamps: true,
});

const Resource = mongoose.model<IResource>('Resource', resourceSchema);

export default Resource;

import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  department: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['OPEN', 'IN PROGRESS', 'RESOLVED', 'ESCALATED'],
    default: 'OPEN'
  },
  urgency: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  anonymous: { type: Boolean, default: false },
  name: String,
  upvotes: { type: Number, default: 0 },
  comments: [{
    text: String,
    author: String,
    createdAt: { type: Date, default: Date.now }
  }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Authority' },
  progressNotes: [{
    note: String,
    author: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Complaint', complaintSchema);
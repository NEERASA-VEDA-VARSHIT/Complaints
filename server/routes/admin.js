import express from 'express';
import Complaint from '../models/Complaint.js';
import Authority from '../models/Authority.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalComplaints: await Complaint.countDocuments(),
      unresolvedComplaints: await Complaint.countDocuments({ 
        status: { $ne: 'RESOLVED' },
        createdAt: { $lt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }
      }),
      mostCommonCategories: await Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Manage authorities
router.post('/authorities', async (req, res) => {
  const authority = new Authority(req.body);
  try {
    const newAuthority = await authority.save();
    res.status(201).json(newAuthority);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
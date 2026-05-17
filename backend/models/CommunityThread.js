import mongoose from 'mongoose';

const communityThreadSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Machine Learning', 'UI/UX', 'Resume & Placements', 'General Doubts']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityReply'
  }],
  uplinkCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.models.CommunityThread || mongoose.model('CommunityThread', communityThreadSchema);

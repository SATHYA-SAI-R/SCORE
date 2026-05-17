import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityThread', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema);

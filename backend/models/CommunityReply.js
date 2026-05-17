import mongoose from 'mongoose';

const communityReplySchema = new mongoose.Schema({
    threadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CommunityThread',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'mentor', 'recruiter', 'admin'],
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.models.CommunityReply || mongoose.model('CommunityReply', communityReplySchema);

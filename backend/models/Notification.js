import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['community-uplink', 'general'], default: 'general' },
    relatedThread: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityThread' },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

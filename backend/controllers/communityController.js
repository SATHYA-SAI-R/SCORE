import CommunityThread from '../models/CommunityThread.js';
import CommunityReply from '../models/CommunityReply.js';

export const createThread = async (req, res) => {
    try {
        const thread = await CommunityThread.create(req.body);
        return res.status(201).json({ success: true, data: thread });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getThreadsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const threads = await CommunityThread.find({ category }).populate('createdBy', 'name avatar role').sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: threads });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getThreadById = async (req, res) => {
    try {
        const thread = await CommunityThread.findById(req.params.id)
            .populate('createdBy', 'name avatar role')
            .populate({
                path: 'replies',
                populate: {
                    path: 'userId',
                    select: 'name avatar role'
                }
            });
        return res.status(200).json({ success: true, data: thread });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const replyToThread = async (req, res) => {
    try {
        const reply = await CommunityReply.create(req.body);
        await CommunityThread.findByIdAndUpdate(req.body.threadId, { $push: { replies: reply._id } });
        return res.status(201).json({ success: true, data: reply });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const uplinkThread = async (req, res) => {
    try {
        const thread = await CommunityThread.findByIdAndUpdate(
            req.params.id,
            { $inc: { uplinkCount: 1 } },
            { new: true }
        );

        if (!thread) {
            return res.status(404).json({ success: false, error: 'Thread not found' });
        }

        return res.status(200).json({ success: true, data: thread, uplinkCount: thread.uplinkCount });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

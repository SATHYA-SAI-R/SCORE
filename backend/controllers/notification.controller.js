import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        return res.status(200).json({ success: true, data: notification });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const createNotification = async (req, res) => {
    try {
        const notification = await Notification.create(req.body);
        return res.status(201).json({ success: true, data: notification });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

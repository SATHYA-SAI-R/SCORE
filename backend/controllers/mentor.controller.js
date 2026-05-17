import Mentor from '../models/Mentor.js';

export const getMentors = async (req, res) => {
    try {
        const mentors = await Mentor.find();
        return res.status(200).json({ success: true, data: mentors });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getMentorById = async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.params.id);
        if (!mentor) return res.status(404).json({ success: false, error: 'Mentor not found' });
        return res.status(200).json({ success: true, data: mentor });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const createMentor = async (req, res) => {
    try {
        const mentor = await Mentor.create({ ...req.body, role: 'mentor' });
        return res.status(201).json({ success: true, data: mentor });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

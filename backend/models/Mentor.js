import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'mentor' },
    skills: [{ type: String }],
    bio: { type: String },
    rating: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Mentor || mongoose.model('Mentor', mentorSchema);

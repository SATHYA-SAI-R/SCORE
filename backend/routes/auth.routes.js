import admin from '../firebase.js'; // Assumes admin is exported from firebase.js
import Mentor from '../models/Mentor.js';

const router = express.Router();

router.post('/verify', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
        }

        const token = authHeader.split('Bearer ')[1];

        // Verify token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email } = decodedToken;

        // Check if user is a mentor in database
        const mentor = await Mentor.findOne({ $or: [{ uid: uid }, { email: email }] });

        if (mentor) {
            return res.json({ role: 'mentor' });
        }

        // Wait... If they are not a mentor, what role should we return? 
        // The prompt says "Return role". If they aren't a mentor, we might return student or recruiter.
        // We'll return based on whatever default logic or if we query another table.
        // Since we don't have a generic User table yet with roles for students and recruiters,
        // we omit role to let frontend use its own fallback.
        return res.json({}); // Provide empty object instead of student fallback

    } catch (error) {
        console.error('Auth verification error:', error);
        return res.status(401).json({ error: 'Unauthorized: ' + error.message });
    }
});

export default router;

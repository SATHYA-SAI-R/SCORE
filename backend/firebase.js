import admin from 'firebase-admin';

// Initialize Firebase Admin (assuming default application setup via env vars or simple init without credential for basic testing, 
// though typically you'd need serviceAccountKey.json. We'll init without args which uses GOOGLE_APPLICATION_CREDENTIALS)
if (!admin.apps.length) {
  admin.initializeApp();
}

export default admin;
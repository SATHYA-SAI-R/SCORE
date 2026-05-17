import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  onAuthStateChanged,
  updatePassword as firebaseUpdatePassword,
  updateProfile as firebaseUpdateProfile,
  deleteUser as firebaseDeleteUser,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "firebase/auth";
import { auth } from "./firebase";
import { getUserProfile, createUserProfile } from "./userService";

// Listen to auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userProfile = await getUserProfile(firebaseUser.uid);
        callback({ ...firebaseUser, ...userProfile });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        callback(firebaseUser); // Fallback
      }
    } else {
      callback(null);
    }
  });
};

export const registerWithEmail = async (email, password, role, profileData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Create profile in Firestore
  await createUserProfile(user.uid, email, role, profileData);
  
  // Send email verification
  await sendEmailVerification(user);
  
  return user;
};

export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;
  
  try {
    const existingProfile = await getUserProfile(user.uid);
    if (!existingProfile) {
       // Profile doesn't exist, throw custom error
       const error = new Error("profile_missing");
       error.code = "auth/profile-missing";
       error.user = user;
       throw error;
    }
  } catch (error) {
    if (error.code === "auth/profile-missing" || error.message.includes("does not exist")) {
        // We know they don't have a profile. 
        // We pass the error up so the frontend can redirect to /register
        const missingError = new Error("profile_missing");
        missingError.code = "auth/profile-missing";
        missingError.user = user;
        throw missingError;
    }
    throw error;
  }
  
  return user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const sendVerification = async () => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  }
};

export const updatePassword = async (newPassword) => {
  if (auth.currentUser) {
    await firebaseUpdatePassword(auth.currentUser, newPassword);
  }
};

export const updateAuthProfile = async (displayName, photoURL) => {
  if (auth.currentUser) {
    await firebaseUpdateProfile(auth.currentUser, { displayName, photoURL });
  }
};

export const deleteUserAccount = async () => {
  if (auth.currentUser) {
    await firebaseDeleteUser(auth.currentUser);
  }
};

export const resetPassword = async (email) => {
  await firebaseSendPasswordResetEmail(auth, email);
};

export const setAuthPersistence = async (rememberMe) => {
  const type = rememberMe ? browserLocalPersistence : browserSessionPersistence;
  await setPersistence(auth, type);
};

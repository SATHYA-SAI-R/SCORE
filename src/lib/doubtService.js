import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  arrayUnion
} from "firebase/firestore";

/**
 * Creates a new doubt post.
 */
export const createDoubt = async (studentId, studentName, title, description, tags = []) => {
  try {
    const doubtRef = await addDoc(collection(db, "doubts"), {
      authorId: studentId,
      authorName: studentName,
      title,
      description,
      tags,
      repliesCount: 0,
      status: 'open',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return doubtRef.id;
  } catch (error) {
    console.error("Error creating doubt:", error);
    throw error;
  }
};

/**
 * Fetches all doubts, ordered by newest first, filtering out resolved ones unless authored by the current user.
 */
export const getDoubts = async (currentUserId) => {
  try {
    const doubtsQuery = query(collection(db, "doubts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(doubtsQuery);
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Format timestamp if it exists, else use current time for immediate optimistic UI rendering
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
      }))
      .filter(doubt => !doubt.status || doubt.status === 'open' || doubt.authorId === currentUserId);
  } catch (error) {
    console.error("Error fetching doubts:", error);
    throw error;
  }
};

/**
 * Adds a reply to a specific doubt.
 */
export const addReplyToDoubt = async (doubtId, userId, userName, userRole, text) => {
  try {
    const doubtRef = doc(db, "doubts", doubtId);
    const doubtSnap = await getDoc(doubtRef);
    
    if (!doubtSnap.exists()) {
      throw new Error("Doubt not found");
    }

    const reply = {
      id: Date.now().toString(), // Simple unique ID for the reply
      userId,
      userName,
      userRole,
      text,
      createdAt: new Date().toISOString()
    };

    await updateDoc(doubtRef, {
      replies: arrayUnion(reply),
      repliesCount: (doubtSnap.data().repliesCount || 0) + 1,
      updatedAt: serverTimestamp()
    });

    return reply;
  } catch (error) {
    console.error("Error adding reply to doubt:", error);
    throw error;
  }
};

/**
 * Gets a specific doubt along with its replies.
 */
export const getDoubtWithReplies = async (doubtId) => {
  try {
    const doubtRef = doc(db, "doubts", doubtId);
    const doubtSnap = await getDoc(doubtRef);
    
    if (!doubtSnap.exists()) {
      throw new Error("Doubt not found");
    }

    const data = doubtSnap.data();
    return {
      id: doubtSnap.id,
      ...data,
      replies: data.replies || [],
      createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching doubt details:", error);
    throw error;
  }
};

/**
 * Marks a doubt as resolved (closed).
 */
export const resolveDoubt = async (doubtId) => {
  try {
    const doubtRef = doc(db, "doubts", doubtId);
    await updateDoc(doubtRef, {
      status: 'resolved',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error resolving doubt:", error);
    throw error;
  }
};


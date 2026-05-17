import { db } from "./firebase";
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, getDoc, doc, updateDoc, runTransaction } from "firebase/firestore";
import { getUserProfile } from "./userService";

export const createReview = async (gigId, gigTitle, studentId, recruiterId, rating, text) => {
  try {
    // 1. Add the review document
    const reviewsRef = collection(db, "reviews");
    
    // Fetch recruiter profile to display their name properly in the review
    let reviewerName = 'Unknown Recruiter';
    try {
        const recruiterProfile = await getUserProfile(recruiterId);
        reviewerName = recruiterProfile.name || recruiterProfile.company || 'Recruiter';
    } catch(e) {
        console.error("Could not fetch recruiter name for review", e);
    }

    const reviewData = {
      gigId,
      gigTitle,
      studentId,
      recruiterId,
      reviewerName,
      rating: Number(rating),
      comment: text,
      createdAt: serverTimestamp()
    };
    
    await addDoc(reviewsRef, reviewData);

    // 2. Transactionally update the student's aggregate rating
    const studentUserRef = doc(db, "users", studentId);
    
    await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(studentUserRef);
        if (!userDoc.exists()) throw new Error("Student does not exist!");
        
        const userData = userDoc.data();
        const roleColl = (userData.role === "Alumni/Mentor" || userData.role === "mentor" || userData.role === "Mentor") 
            ? "studentProfile" // Using same subcollection for mentors for now based on userService
            : "studentProfile";
            
        const profileRef = doc(db, `users/${studentId}/${roleColl}`, "data");
        const profileDoc = await transaction.get(profileRef);
        
        if (profileDoc.exists()) {
            const currentProfile = profileDoc.data();
            const currentTotalRating = (currentProfile.rating || 0) * (currentProfile.completedGigs || 0);
            const newCompletedGigs = (currentProfile.completedGigs || 0) + 1;
            const newRating = (currentTotalRating + Number(rating)) / newCompletedGigs;
            
            transaction.update(profileRef, {
                rating: Number(newRating.toFixed(1)),
                completedGigs: newCompletedGigs
            });
        }
    });

    return true;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const subscribeToStudentReviews = (studentId, callback) => {
  const q = query(
    collection(db, "reviews"),
    where("studentId", "==", studentId)
  );

  return onSnapshot(q, (snapshot) => {
    const reviews = [];
    snapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    // Sort client-side since we are not creating composite indexes right now for simplicity
    reviews.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
    });
    callback(reviews);
  });
};

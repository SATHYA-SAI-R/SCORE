import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, getDoc, onSnapshot, increment } from "firebase/firestore";

export const applyForGig = async (applicationData) => {
  // Check if standard duplicate exists
  const q = query(
    collection(db, "applications"),
    where("studentId", "==", applicationData.studentId),
    where("gigId", "==", applicationData.gigId)
  );
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    throw new Error("You have already applied for this gig.");
  }

  const newAppData = {
    ...applicationData,
    status: "pending",
    appliedAt: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, "applications"), newAppData);
  return { id: docRef.id, ...newAppData };
};

export const getApplicationsByStudent = async (studentId) => {
  const q = query(collection(db, "applications"), where("studentId", "==", studentId));
  const querySnapshot = await getDocs(q);
  const applications = [];
  querySnapshot.forEach((doc) => {
    applications.push({ id: doc.id, ...doc.data() });
  });
  return applications.sort((a,b) => new Date(b.appliedAt) - new Date(a.appliedAt));
};

export const subscribeToStudentApplications = (studentId, callback) => {
  const q = query(collection(db, "applications"), where("studentId", "==", studentId));
  return onSnapshot(q, (snapshot) => {
    const apps = [];
    snapshot.forEach((doc) => {
      apps.push({ id: doc.id, ...doc.data() });
    });
    callback(apps.sort((a,b) => new Date(b.appliedAt) - new Date(a.appliedAt)));
  });
};

export const getApplicationsByGig = async (gigId) => {
  const q = query(collection(db, "applications"), where("gigId", "==", gigId));
  const querySnapshot = await getDocs(q);
  const applications = [];
  querySnapshot.forEach((doc) => {
    applications.push({ id: doc.id, ...doc.data() });
  });
  return applications.sort((a,b) => new Date(b.appliedAt) - new Date(a.appliedAt));
};

export const subscribeToRecruiterApplications = (recruiterId, callback) => {
  const q = query(collection(db, "applications"), where("recruiterId", "==", recruiterId));
  return onSnapshot(q, (snapshot) => {
    const apps = [];
    snapshot.forEach((doc) => {
      apps.push({ id: doc.id, ...doc.data() });
    });
    callback(apps.sort((a,b) => new Date(b.appliedAt) - new Date(a.appliedAt)));
  });
};

export const updateApplicationStatus = async (appId, status) => {
  const docRef = doc(db, "applications", appId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("Application not found");
  }

  const application = docSnap.data();
  if (application.status === 'accepted' && status === 'accepted') {
    throw new Error("Application has already been accepted");
  }

  await updateDoc(docRef, { status });

  if (status === 'accepted' && application.recruiterId) {
    const recruiterRoleRef = doc(db, `users/${application.recruiterId}/recruiterProfile`, "data");
    try {
      await updateDoc(recruiterRoleRef, { totalHired: increment(1) });
    } catch (error) {
       console.warn("Could not increment totalHired, recruiterProfile might not exist.");
    }
  }
};

import { db } from "./firebase";
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";

export const createGig = async (gigData) => {
  const newGigData = {
    ...gigData,
    status: "hiring",
    createdAt: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, "gigs"), newGigData);
  return { id: docRef.id, ...newGigData };
};

export const getGigs = async (filters = {}) => {
  let q = collection(db, "gigs");
  
  if (filters.status) {
    q = query(q, where("status", "==", filters.status));
  }
  if (filters.postedBy) {
    q = query(q, where("postedBy", "==", filters.postedBy));
  }
  // Order by createdAt desc by default (requires composite index if multiple where clauses used)
  // q = query(q, orderBy("createdAt", "desc"));

  const querySnapshot = await getDocs(q);
  const gigs = [];
  querySnapshot.forEach((doc) => {
    gigs.push({ id: doc.id, ...doc.data() });
  });
  
  return gigs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)); // fallback sort
};

export const getGigById = async (gigId) => {
  const docRef = doc(db, "gigs", gigId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("No such gig!");
  }
};

export const updateGig = async (gigId, updateData) => {
  const docRef = doc(db, "gigs", gigId);
  await updateDoc(docRef, updateData);
};

export const deleteGig = async (gigId) => {
  const docRef = doc(db, "gigs", gigId);
  await deleteDoc(docRef);
};

export const subscribeToGigs = (callback) => {
  const q = query(collection(db, "gigs"), where("status", "==", "hiring"));
  return onSnapshot(q, (snapshot) => {
    const gigs = [];
    snapshot.forEach((doc) => {
      gigs.push({ id: doc.id, ...doc.data() });
    });
    // sort by date
    callback(gigs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
  });
};

export const subscribeToRecruiterGigs = (uid, callback) => {
  const q = query(collection(db, "gigs"), where("postedBy", "==", uid));
  return onSnapshot(q, (snapshot) => {
    const gigs = [];
    snapshot.forEach((doc) => {
      gigs.push({ id: doc.id, ...doc.data() });
    });
    callback(gigs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
  });
};

import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

export const createUserProfile = async (uid, email, role, profileData) => {
  const userRef = doc(db, "users", uid);
  
  const baseData = {
    uid,
    email,
    role,
    name: profileData.fullName || profileData.name || "Unknown",
    photoURL: profileData.photoURL || null,
    bio: profileData.bio || "",
    createdAt: new Date().toISOString()
  };
  
  await setDoc(userRef, baseData);

  // Determine subprofile type based on role
  if (role === "student" || role === "School Student" || role === "College Student") {
    const studentProfileRef = doc(db, `users/${uid}/studentProfile`, "data");
    await setDoc(studentProfileRef, {
      institution: profileData.institution || "",
      graduationYear: profileData.graduationYear || "",
      graduationMonth: profileData.graduationMonth || "",
      course: profileData.course || "",
      skills: profileData.skills || [],
      portfolio: profileData.portfolio || "",
      rating: 0,
      totalEarnings: 0,
      completedGigs: 0
    });
  } else if (role === "recruiter" || role === "Recruiter") {
    const recruiterProfileRef = doc(db, `users/${uid}/recruiterProfile`, "data");
    await setDoc(recruiterProfileRef, {
      company: profileData.institution || "",
      position: profileData.course || "", // reusing course field from form
      experience: profileData.graduationYear || "", // reusing graduationYear field from form
      activeListings: 0,
      totalHired: 0
    });
  } else if (role === "Alumni/Mentor") {
    const mentorProfileRef = doc(db, `users/${uid}/studentProfile`, "data");
    await setDoc(mentorProfileRef, {
      company: profileData.institution || "",
      position: profileData.course || "",
      experience: profileData.graduationYear || "",
      skills: profileData.skills || [],
      rating: 0
    });
  }
};

export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    throw new Error("User profile does not exist");
  }
  
  const userData = userSnap.data();
  let roleData = {};
  
  if (userData.role === "student" || userData.role === "School Student" || userData.role === "College Student" || userData.role === "Alumni/Mentor") {
    const studentDataSnap = await getDoc(doc(db, `users/${uid}/studentProfile`, "data"));
    if (studentDataSnap.exists()) {
      const sData = studentDataSnap.data();
      
      // Auto-graduation logic
      if (sData.graduationYear && sData.graduationMonth && (userData.role === "School Student" || userData.role === "student" || userData.role === "College Student")) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // 1-12
        const gradYear = parseInt(sData.graduationYear, 10);
        const gradMonth = parseInt(sData.graduationMonth, 10);

        if (gradYear < currentYear || (gradYear === currentYear && currentMonth > gradMonth)) {
          let newRole = userData.role;
          if (userData.role === "School Student") {
            newRole = "College Student";
          } else if (userData.role === "student" || userData.role === "College Student") {
            newRole = "Alumni/Mentor";
          }
          
          if (newRole !== userData.role) {
            const updatePayload = { role: newRole, updatedAt: new Date().toISOString() };
            if (newRole === "College Student") {
               updatePayload.needsGraduationUpdate = true;
               userData.needsGraduationUpdate = true;
            }
            await updateDoc(userRef, updatePayload);
            userData.role = newRole;
          }
        }
      }

      roleData = {
        ...sData,
        roleTitle: sData.roleTitle || sData.course || userData.role,
        education: sData.education || sData.institution || "Not Specified",
        experience: sData.experience || (sData.graduationYear ? `Class of ${sData.graduationYear}` : ""),
        location: sData.location || userData.location || "Remote",
      };
    }
  } else if (userData.role === "recruiter" || userData.role === "Recruiter") {
    const recruiterDataSnap = await getDoc(doc(db, `users/${uid}/recruiterProfile`, "data"));
    if (recruiterDataSnap.exists()) {
      const rData = recruiterDataSnap.data();
      roleData = {
        ...rData,
        roleTitle: rData.roleTitle || rData.position || "Recruiter",
        education: rData.education || rData.company || "Not Specified",
        experience: rData.experience || "",
        location: rData.location || userData.location || "Remote",
      };
    }
  }

  return { ...userData, ...roleData };
};

export const updateUserProfile = async (uid, updateData, roleUpdateData) => {
  const userRef = doc(db, "users", uid);
  
  // Filter base vs role data depending on what's passed
  if (Object.keys(updateData).length > 0) {
    updateData.updatedAt = new Date().toISOString();
    await updateDoc(userRef, updateData);
  }
  
  if (roleUpdateData && Object.keys(roleUpdateData).length > 0) {
    const userRole = (await getDoc(userRef)).data().role;
    let roleCollection = "studentProfile";
    if (userRole === "recruiter" || userRole === "Recruiter") {
      roleCollection = "recruiterProfile";
    }
    const roleRef = doc(db, `users/${uid}/${roleCollection}`, "data");
    await updateDoc(roleRef, roleUpdateData);
  }
};

export const searchTalent = async (filters) => {
  // A simple talent search based on role
  // Complex filtering (like 'skills array-contains') is better done in UI or via combined queries in Firestore
  const q = query(
    collection(db, "users"), 
    where("role", "in", ["student", "School Student", "College Student", "Alumni/Mentor"])
  );
  const querySnapshot = await getDocs(q);
  const talents = [];
  
  for (const docSnap of querySnapshot.docs) {
    // We also need to fetch their studentProfile to filter further by skills etc.
    const uid = docSnap.id;
    try {
        const fullProf = await getUserProfile(uid);
        talents.push(fullProf);
    } catch(e) {
        console.error("Could not fetch full profile for", uid);
    }
  }
  
  return talents;
};

export const getMentors = async () => {
  const q = query(
    collection(db, "users"),
    where("role", "in", ["mentor", "Alumni/Mentor", "Mentor"])
  );
  const querySnapshot = await getDocs(q);
  const mentors = [];
  
  for (const docSnap of querySnapshot.docs) {
    const uid = docSnap.id;
    try {
        const fullProf = await getUserProfile(uid);
        mentors.push({ ...fullProf, id: uid });
    } catch(e) {
        console.error("Could not fetch full profile for mentor", uid);
    }
  }
  
  return mentors;
};

export const deleteUserData = async (uid, role) => {
  const userRef = doc(db, "users", uid);
  
  let roleCollection = "studentProfile";
  if (role === "recruiter" || role === "Recruiter") {
    roleCollection = "recruiterProfile";
  }
  
  const roleRef = doc(db, `users/${uid}/${roleCollection}`, "data");
  
  // Delete subcollection data
  await deleteDoc(roleRef);
  
  // Delete base user document
  await deleteDoc(userRef);
};

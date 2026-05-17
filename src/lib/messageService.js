import { db } from "./firebase";
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, setDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

export const getConversations = async (uid) => {
  const q = query(
    collection(db, "conversations"),
    where("participants", "array-contains", uid)
  );
  
  const querySnapshot = await getDocs(q);
  const conversations = [];
  querySnapshot.forEach((doc) => {
    conversations.push({ id: doc.id, ...doc.data() });
  });
  
  return conversations.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};

export const subscribeToConversations = (uid, callback) => {
  const q = query(
    collection(db, "conversations"),
    where("participants", "array-contains", uid)
  );
  
  return onSnapshot(q, (snapshot) => {
    const convs = [];
    snapshot.forEach((doc) => {
      convs.push({ id: doc.id, ...doc.data() });
    });
    callback(convs.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
  });
};

export const subscribeToMessages = (conversationId, callback) => {
  const q = query(
    collection(db, `conversations/${conversationId}/messages`),
    orderBy("timestamp", "asc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const msgs = [];
    snapshot.forEach((doc) => {
      msgs.push({ id: doc.id, ...doc.data() });
    });
    callback(msgs);
  });
};

export const sendMessage = async (conversationId, senderId, text, participants = []) => {
  const msgData = {
    senderId,
    text,
    timestamp: new Date().toISOString()
  };
  
  const convRef = doc(db, "conversations", conversationId);
  const convSnap = await getDoc(convRef);
  
  if (!convSnap.exists() && participants.length > 0) {
    // Create conversation if it doesn't exist yet
    await setDoc(convRef, {
      participants,
      lastMessage: text,
      updatedAt: new Date().toISOString()
    });
  } else if (convSnap.exists()) {
    // Update last message
    await updateDoc(convRef, {
      lastMessage: text,
      updatedAt: new Date().toISOString()
    });
  }

  const messagesRef = collection(db, `conversations/${conversationId}/messages`);
  await addDoc(messagesRef, msgData);
};

export const editMessage = async (conversationId, messageId, newText) => {
  const msgRef = doc(db, `conversations/${conversationId}/messages`, messageId);
  await updateDoc(msgRef, {
    text: newText,
    isEdited: true,
    updatedAt: new Date().toISOString()
  });
};


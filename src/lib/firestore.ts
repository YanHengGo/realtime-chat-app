// src/lib/firestore.ts
import { db } from "./firebase";
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    orderBy,
    onSnapshot,
    QuerySnapshot,
    DocumentData,
  } from "firebase/firestore";
  
export const subscribeToMessages = (
  roomId: string,
  callback: (messages: DocumentData[]) => void
) => {
  const q = query(
    collection(db, "messages"),
    where("roomId", "==", roomId),
    orderBy("createdAt", "asc")
  );

  const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(docs);
  });

  return unsubscribe; // 使用側で呼び出してクリーンアップ
};
export const sendMessageToRoom = async ({
  roomId,
  uid,
  text,
}: {
  roomId: string;
  uid: string;
  text: string;
}) => {
  if (!text.trim()) return;

  await addDoc(collection(db, "messages"), {
    roomId,
    uid,
    text,
    createdAt: serverTimestamp(),
  });
};
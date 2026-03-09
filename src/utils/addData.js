import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase-config";

export const addData = async (formData) => {
  try {
    const docRef = await addDoc(
      collection(db, import.meta.env.VITE_FIREBASE_QR_COL),
      {
        ...formData,
        // entryTime: serverTimestamp(),
        // mcid: mcid,
      },
    );
    console.log("✅ Document written with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding document:", error);
    throw error;
  }
};

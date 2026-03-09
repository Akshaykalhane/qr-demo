import { db } from "../firebase-config";
import { doc, updateDoc } from "firebase/firestore";

async function updateUserDataById(userId, updatedData) {
  const userDocRef = doc(db, import.meta.env.VITE_FIREBASE_QR_COL, userId);

  try {
    await updateDoc(userDocRef, updatedData);
    console.log("Document updated successfully.");
  } catch (error) {
    console.error("Error updating document:", error);
  }
}

export default updateUserDataById;

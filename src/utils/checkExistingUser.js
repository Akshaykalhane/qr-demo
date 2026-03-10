import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

export const checkExistingUser = async (email, phone, collectionName) => {
  try {
    const emailQuery = query(
      collection(db, collectionName),
      where("email", "==", email),
    );

    const phoneQuery = query(
      collection(db, collectionName),
      where("phone", "==", phone),
    );

    const [emailSnap, phoneSnap] = await Promise.all([
      getDocs(emailQuery),
      getDocs(phoneQuery),
    ]);

    return {
      emailExists: !emailSnap.empty,
      phoneExists: !phoneSnap.empty,
    };
  } catch (err) {
    console.error(err);
    return { emailExists: false, phoneExists: false };
  }
};

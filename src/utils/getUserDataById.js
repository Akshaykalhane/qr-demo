import { db } from "../firebase-config";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

export const allDataFetch = async () => {
  try {
    const usersRef = collection(db, import.meta.env.VITE_FIREBASE_QR_COL);
    const querySnapshot = await getDocs(usersRef);
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    return null;
  }
};

export const getUserDataById = async (userId) => {
  try {
    if (!userId) return null;

    const docRef = doc(db, import.meta.env.VITE_FIREBASE_QR_COL, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("✅ User data fetched successfully.");
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("❌ No such user found.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return null;
  }
};

export const getUserDataByMcid = async (mcid) => {
  try {
    if (!mcid) return null;

    const q = query(
      collection(db, import.meta.env.VITE_FIREBASE_QR_COL),
      where("mcid", "==", mcid),
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const allMatches = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      /*  // Filter by allowed cities (if provided)
      const filtered =
        allowedCities.length > 0
          ? allMatches.filter((doc) => allowedCities.includes(doc.city))
          : allMatches;

      if (filtered.length > 0) {
        console.log("✅ Matching user(s) found after filtering.");
        return filtered[0]; // Or return the full array if needed
      } else {
        console.log("❌ No users found in allowed cities.");
        return null;
      } */

      console.log("✅ User data fetched successfully.");
      return allMatches;
    } else {
      console.log("❌ No users found with that mcid.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching user by mcid:", error);
    return null;
  }
};

export const listenToUserDataById = (userId, callback) => {
  if (!userId) return;

  const docRef = doc(db, import.meta.env.VITE_FIREBASE_QR_COL, userId);

  // Set up real-time listener
  const unsubscribe = onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        console.log("📡 Real-time update received.");
        callback({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("❌ User not found.");
        callback(null);
      }
    },
    (error) => {
      console.error("❌ Real-time listener error:", error);
      callback(null);
    },
  );

  return unsubscribe;
};

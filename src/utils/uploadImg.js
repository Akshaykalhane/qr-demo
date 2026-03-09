import { ref, uploadString, getDownloadURL } from "firebase/storage";

import { storagedb } from "../firebase-config";

export async function uploadBase64Image(base64Image, filePath) {
  try {
    const storageRef = ref(storagedb, filePath);

    // Upload base64 string
    const snapshot = await uploadString(storageRef, base64Image, "data_url");

    // Get public download url
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
}

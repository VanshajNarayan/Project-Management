import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDtRJuLzHAm26jg2bhRsG_3aCTs6O26A8M",
  authDomain: "project-management-e896c.firebaseapp.com",
  projectId: "project-management-e896c",
  storageBucket: "project-management-e896c.firebasestorage.app",
  messagingSenderId: "937154446633",
  appId: "1:937154446633:web:0d4148f9256a6cffb3a338",
  measurementId: "G-75JB9V6EBX",
};

// ? Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ? Use emulators for local development
// if (process.env.NODE_ENV === "development") {
//   try {
//     // ? Uncomment these lines when using Firebase emulators locally
//     // connectAuthEmulator(auth, "http://localhost:9099");
//     // connectFirestoreEmulator(db, "localhost", 8080);
//     // connectStorageEmulator(storage, "localhost", 9199);
//   } catch (error) {
//     console.error("Error connecting to Firebase emulators:", error);
//   }
// }

export { app, auth, db, storage };

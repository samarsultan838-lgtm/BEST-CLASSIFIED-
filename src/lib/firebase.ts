import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);

// The app will break without passing the firestoreDatabaseId
// Using initializeFirestore with experimentalForceLongPolling to fix connection issues
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

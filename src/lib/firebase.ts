import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase configuration object
 * Contains credentials and settings for the Firebase project
 */
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
  
};

/**
 * Initialize Firebase application instance
 */
export const app = initializeApp(firebaseConfig);

/**
 * Initialize Firebase Authentication
 * Configure to use device language for emails
 */
export const auth = getAuth(app);
auth.useDeviceLanguage(); // Use the device's language for authentication emails

/**
 * Initialize Firestore database instance
 */
export const db = getFirestore(app);

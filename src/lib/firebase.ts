import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase configuration object
 * Contains credentials and settings for the Firebase project
 */
const firebaseConfig = {
  apiKey: "AIzaSyCud7Z39k6M6PjaCs9yAIeBajWWS4cQpuo",
  authDomain: "hopehive-c660c.firebaseapp.com",
  projectId: "hopehive-c660c",
  storageBucket: "hopehive-c660c.firebasestorage.app",
  messagingSenderId: "534794528490",
  appId: "1:534794528490:web:7cd8751745021024ca5993",
  measurementId: "G-5DFP0V4VV0"
  
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

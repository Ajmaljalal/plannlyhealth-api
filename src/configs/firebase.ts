import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY, // replace withprocess.env.FIREBASE values
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

// Check if Firebase was already initialized
const apps = getApps();
let firebaseApp;
if (!apps.length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = apps[0];
}

const analytics = getAnalytics(firebaseApp);

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Initialize Auth
const auth = getAuth(firebaseApp);

export { firebaseApp, db, auth };

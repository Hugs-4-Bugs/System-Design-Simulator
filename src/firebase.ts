import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, onSnapshot, serverTimestamp, getDocFromServer, increment, deleteDoc } from 'firebase/firestore';

// Import the Firebase configuration
import firebaseConfigData from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

const firestoreDatabaseId = firebaseConfigData.firestoreDatabaseId;

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error.message?.includes('the client is offline')) {
      console.error("Firestore Error: The client is offline. This usually means the Project ID or API Key in your .env is incorrect, or the domain is not authorized.");
    } else if (error.code === 'permission-denied') {
      // This is actually a GOOD sign - it means we connected but rules blocked us
      console.log("Firestore connected successfully (Permission denied as expected for test doc).");
    } else {
      console.error("Firestore Connection Detail:", error.message);
    }
  }
}
testConnection();

export { signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, doc, setDoc, getDoc, collection, query, where, onSnapshot, serverTimestamp, increment, deleteDoc };

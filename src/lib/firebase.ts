// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIF9wqmqtbgl0HGjo49STcgRsWJO8Lvk4",
  authDomain: "lifehorizonit.firebaseapp.com",
  projectId: "lifehorizonit",
  storageBucket: "lifehorizonit.firebasestorage.app",
  messagingSenderId: "235190753778",
  appId: "1:235190753778:web:5fc9bbb088d41bbcfcf36b",
  measurementId: "G-MX8FYTMD4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => analytics = yes ? getAnalytics(app) : null);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, db, storage };

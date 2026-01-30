import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Firebase Storage removed - using IPFS/Pinata instead

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA76tM-cejeesNCxFueBsOQdpcN60fJwRw",
    authDomain: "house-rent-ai.firebaseapp.com",
    projectId: "house-rent-ai",
    storageBucket: "house-rent-ai.firebasestorage.app",
    messagingSenderId: "1071201688827",
    appId: "1:1071201688827:web:b31f0255639e7b40d7a45e",
    measurementId: "G-P31W6E6MC2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
// Storage removed - using IPFS/Pinata instead
const googleProvider = new GoogleAuthProvider();

export { app, auth, analytics, db, googleProvider };
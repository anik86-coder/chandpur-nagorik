import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// আপনার অরিজিনাল ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyAjI9g5G6nXgy-2YXfKOOpulsoFDgNKaak",
  authDomain: "chandpur-nagorik.firebaseapp.com",
  projectId: "chandpur-nagorik",
  storageBucket: "chandpur-nagorik.firebasestorage.app",
  messagingSenderId: "348680951209",
  appId: "1:348680951209:web:a513d455866e2fd79de0b8"
};

// Next.js এর জন্য সেফ ইনিশিয়ালাইজেশন (যাতে বারবার রিলোডে এরর না দেয়)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
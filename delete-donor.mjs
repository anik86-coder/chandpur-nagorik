import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

// [গুরুত্বপূর্ণ]: নিচে আপনার firebase.ts ফাইলে থাকা আসল কি (key) গুলো বসিয়ে দিন
const firebaseConfig = {
  apiKey: "AIzaSyAjI9g5G6nXgy-2YXfKOOpulsoFDgNKaak",
  authDomain: "chandpur-nagorik.firebaseapp.com",
  projectId: "chandpur-nagorik",
  storageBucket: "chandpur-nagorik.appspot.com",
  messagingSenderId: "1051443500000",
  appId: "1:1051443500000:web:1234567890abcdef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// টার্মিনাল থেকে আইডি নেওয়া
const donorId = process.argv[2];

if (!donorId) {
  console.error("❌ এরর: অনুগ্রহ করে ডোনারের ID দিন।");
  console.log("👉 ব্যবহারের নিয়ম: node delete-donor.mjs <DONOR_ID>");
  process.exit(1);
}

async function deleteDonor() {
  try {
    console.log(`⏳ ডোনার (ID: ${donorId}) ডিলিট করা হচ্ছে...`);
    await deleteDoc(doc(db, "donors", donorId));
    console.log("✅ ডোনার সফলভাবে ডাটাবেস থেকে মুছে ফেলা হয়েছে!");
    process.exit(0);
  } catch (error) {
    console.error("❌ ডিলিট করতে সমস্যা হয়েছে:", error);
    process.exit(1);
  }
}

deleteDonor();
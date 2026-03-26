import { initializeApp, deleteApp } from 'firebase/app'; // [আপডেট] deleteApp যুক্ত করা হয়েছে
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';

// নিচে আপনার firebase.ts ফাইলে থাকা আসল কি (key) গুলো বসিয়ে দিন
const firebaseConfig = {
  apiKey: "AIzaSyAjI9g5G6nXgy-2YXfKOOpulsoFDgNKaak",
  authDomain: "chandpur-nagorik.firebaseapp.com",
  projectId: "chandpur-nagorik",
  storageBucket: "chandpur-nagorik.firebasestorage.app",
  messagingSenderId: "348680951209",
  appId: "1:348680951209:web:a513d455866e2fd79de0b8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const donorId = process.argv[2];

if (!donorId) {
  console.error("❌ Error: Please provide a Donor ID to search.");
  console.log("👉 Usage: node view-donors.mjs <DONOR_ID>");
  process.exit(1);
}

async function viewSingleDonor() {
  try {
    console.log(`\n⏳ Searching for Donor (ID: ${donorId})...\n`);
    
    const docRef = doc(db, "donors", donorId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      const donorInfo = {
        Name: data.name,
        Group: data.group,
        Email: data.email,
        Phone: data.phone,
        DOB: data.dob,
        ID: docSnap.id
      };

      console.table([donorInfo]); 
      console.log(`\n✅ Donor information retrieved successfully!\n`);
    } else {
      console.log(`❌ Sorry! No donor found with ID '${donorId}'.\n`);
    }

  } catch (error) {
    console.error("❌ Error retrieving data:", error);
  } finally {
    // [ম্যাজিক ফিক্স]: ফায়ারবেস কানেকশন ভদ্রভাবে ক্লোজ করা হচ্ছে
    await deleteApp(app);
  }
}

viewSingleDonor();
import { initializeApp } from 'firebase/app';
// [ম্যাজিক]: এখানে 'firebase/firestore' এর বদলে '/lite' যুক্ত করা হয়েছে!
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';

// আপনার ফায়ারবেসের আসল কি (key) গুলো সাবধানে বসান (কোনো স্পেস যেন না থাকে)
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

// টার্মিনাল থেকে আইডি নেওয়া
const donorId = process.argv[2];

if (!donorId) {
  console.error("❌ এরর: অনুগ্রহ করে সার্চ করার জন্য ডোনারের ID দিন।");
  console.log("👉 ব্যবহারের নিয়ম: node view-donors.mjs <DONOR_ID>");
  process.exit(1);
}

async function viewSingleDonor() {
  try {
    console.log(`⏳ ডোনার (ID: ${donorId}) খোঁজা হচ্ছে...\n`);
    
    // ডাটাবেস থেকে শুধু নির্দিষ্ট আইডির ডেটা আনা
    const docRef = doc(db, "donors", donorId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // সুন্দর করে দেখানোর জন্য ডাটা সাজানো
      const donorInfo = {
        নাম: data.name,
        গ্রুপ: data.group,
        ইমেইল: data.email,
        মোবাইল: data.phone,
        জন্মতারিখ: data.dob,
        ID: docSnap.id
      };

      console.table([donorInfo]); 
      console.log(`\n✅ ডোনারের তথ্য সফলভাবে পাওয়া গেছে!`);
    } else {
      console.log(`❌ দুঃখিত! '${donorId}' এই আইডি দিয়ে কোনো ডোনার পাওয়া যায়নি।`);
    }

    process.exit(0);

  } catch (error) {
    console.error("❌ তথ্য আনতে সমস্যা হয়েছে:", error);
    process.exit(1);
  }
}

viewSingleDonor();
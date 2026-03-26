import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore/lite';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

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
  console.error("❌ Error: Please provide a Donor ID to edit.");
  console.log("👉 Usage: node edit-donor.mjs <DONOR_ID>");
  process.exit(1);
}

async function editDonor() {
  const rl = readline.createInterface({ input, output });

  try {
    console.log(`\n⏳ Searching for Donor (ID: ${donorId}) in database...\n`);
    
    const donorRef = doc(db, "donors", donorId);
    const docSnap = await getDoc(donorRef);

    if (!docSnap.exists()) {
      console.log(`❌ Sorry! No donor found with ID '${donorId}'.`);
      rl.close();
      process.exit(1);
    }

    const currentData = docSnap.data();
    console.log("✅ Donor found! Enter new details (Leave blank and press Enter to keep current value):\n");

    const newName = await rl.question(`1. Name [Current: ${currentData.name}]: `);
    const newGroup = await rl.question(`2. Blood Group [Current: ${currentData.group}]: `);
    const newPhone = await rl.question(`3. Phone [Current: ${currentData.phone}]: `);
    const newDob = await rl.question(`4. Date of Birth [Current: ${currentData.dob}]: `);
    const newAddress = await rl.question(`5. Address [Current: ${currentData.address}]: `);
    const newEmail = await rl.question(`6. Email [Current: ${currentData.email}]: `);
    const newDisease = await rl.question(`7. Disease [Current: ${currentData.disease || 'None'}]: `);
    const newAllergy = await rl.question(`8. Allergy [Current: ${currentData.allergy || 'None'}]: `);

    console.log("\n⏳ Updating donor information...");

    const updatedData = {
      name: newName.trim() || currentData.name,
      group: newGroup.trim() || currentData.group,
      phone: newPhone.trim() || currentData.phone,
      dob: newDob.trim() || currentData.dob,
      address: newAddress.trim() || currentData.address,
      email: newEmail.trim() ? newEmail.trim().toLowerCase() : currentData.email,
      disease: newDisease.trim() || currentData.disease,
      allergy: newAllergy.trim() || currentData.allergy,
    };

    await updateDoc(donorRef, updatedData);
    console.log("🎉 Donor updated successfully!\n");

  } catch (error) {
    console.error("❌ Error updating donor:", error);
  } finally {
    rl.close();
    process.exit(0);
  }
}

editDonor();
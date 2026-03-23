import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Categories map: You see English in Terminal, but it saves Bengali in .md file
const categories = [
  { en: "National", bn: "সারাদেশ" },
  { en: "Chandpur", bn: "চাঁদপুর" },
  { en: "Politics", bn: "রাজনীতি" },
  { en: "Economy", bn: "অর্থনীতি" },
  { en: "Sports", bn: "ক্রীড়া" },
  { en: "International", bn: "আন্তর্জাতিক" },
  { en: "Technology", bn: "টেকনোলজি" },
  { en: "Entertainment", bn: "বিনোদন" },
  { en: "Education", bn: "শিক্ষা" },
  { en: "Health", bn: "স্বাস্থ্য" },
  { en: "Religion", bn: "ধর্ম" },
  { en: "Expatriate", bn: "প্রবাস" },
  { en: "Lifestyle", bn: "লাইফস্টাইল" },
  { en: "Opinion", bn: "মতামত" }
];

console.log("\n==================================");
console.log("   📰 CREATE A NEW POST");
console.log("==================================\n");

categories.forEach((cat, index) => {
  console.log(` [${index + 1}] ${cat.en}`);
});

console.log("\n----------------------------------");

rl.question('👉 Enter category number (e.g., 1): ', (catIndex) => {
  const selectedIndex = parseInt(catIndex) - 1;
  // Fallback to "সারাদেশ" (National) if input is invalid
  const category = (categories[selectedIndex] && categories[selectedIndex].bn) ? categories[selectedIndex].bn : "সারাদেশ"; 

  rl.question('👉 Enter post title: ', (title) => {
    rl.question('👉 Enter image URL (press Enter to skip): ', (image) => {
      rl.question('👉 Enter author name (press Enter to skip): ', (author) => {

        // Generate 10-digit secret slug
        const slug = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        // Get current date and time
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
        const time = now.toLocaleTimeString('en-US', timeOptions);

        const finalImage = image || "https://res.cloudinary.com/dfzirugge/image/upload/v1774084245/3_u1xeqx.png";
        const finalAuthor = author || "নিজস্ব প্রতিবেদক";
        const finalTitle = title || "Untitled News";

        // Generate Markdown content
        const markdownContent = `---
title: "${finalTitle}"
date: "${date}"
time: "${time}"
category: "${category}"
image: "${finalImage}"
author: "${finalAuthor}"
---

Write your news content here...
`;

        // Save file
        const filePath = path.join(process.cwd(), 'content', 'news', `${slug}.md`);
        fs.writeFileSync(filePath, markdownContent, 'utf8');

        console.log("\n✅ Post created successfully!");
        console.log(`📂 File Location: content/news/${slug}.md`);
        console.log(`🔗 Link ID (Slug): ${slug}\n`);

        rl.close();
      });
    });
  });
});
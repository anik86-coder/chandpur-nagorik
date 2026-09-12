export default function BloodBankTermsPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8 font-[Kalpurush]">
      <div className="max-w-3xl mx-auto">

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="px-6 md:px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              রক্তদাতা — Terms & Conditions
            </h1>

            <p className="text-gray-500 text-sm mt-2">
              রক্তদাতা হিসেবে নিবন্ধনের আগে নিচের বিষয়গুলো পড়ে নিন।
            </p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 text-gray-700 leading-relaxed space-y-6">

            <section>
              <h2 className="font-bold text-lg text-gray-900 mb-2">
                ১. স্বেচ্ছায় রক্তদান
              </h2>

              <p>
                রক্তদাতা নিজ ইচ্ছায় এবং স্বেচ্ছায় এই প্ল্যাটফর্মে
                রক্তদাতা হিসেবে নিবন্ধন করবেন। কোনো ধরনের জোর,
                চাপ বা বাধ্যবাধকতার মাধ্যমে নিবন্ধন করা যাবে না।
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg text-gray-900 mb-2">
                ২. সঠিক তথ্য প্রদান
              </h2>

              <p>
                নিবন্ধনের সময় নিজের নাম, রক্তের গ্রুপ, মোবাইল নম্বর,
                জন্মতারিখ, ঠিকানা এবং ইমেইলসহ প্রয়োজনীয় তথ্য সঠিকভাবে
                প্রদান করতে হবে।
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg text-gray-900 mb-2">
                ৩. স্বাস্থ্য সংক্রান্ত তথ্য
              </h2>

              <p>
                কোনো রোগ বা অ্যালার্জি থাকলে তা সঠিকভাবে উল্লেখ করা
                উচিত। রক্তদানের আগে নিজের শারীরিক অবস্থার বিষয়ে
                প্রয়োজনীয় সতর্কতা অবলম্বন করা প্রত্যেক রক্তদাতার
                নিজস্ব দায়িত্ব।
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg text-gray-900 mb-2">
                ৪. যোগাযোগ
              </h2>

              <p>
                রক্তের প্রয়োজন হলে প্রদত্ত যোগাযোগের তথ্য ব্যবহার করে
                রক্তদাতার সঙ্গে যোগাযোগ করা হতে পারে। তাই নিবন্ধনের
                সময় দেওয়া তথ্য সঠিক ও সচল রাখা গুরুত্বপূর্ণ।
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg text-gray-900 mb-2">
                ৫. তথ্যের ব্যবহার
              </h2>

              <p>
                রক্তদাতার দেওয়া তথ্য মূলত রক্তদাতা খুঁজে পাওয়া এবং
                প্রয়োজনীয় যোগাযোগের উদ্দেশ্যে ব্যবহার করা হবে।
                অপ্রয়োজনীয় বা অসৎ উদ্দেশ্যে তথ্য ব্যবহার করা উচিত নয়।
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg text-gray-900 mb-2">
                ৬. তথ্য পরিবর্তন
              </h2>

              <p>
                রক্তদানের পর রক্তদাতা তার donation status আপডেট করতে
                পারবেন। ভবিষ্যতে তথ্য পরিবর্তনের প্রয়োজন হলে
                নিবন্ধিত ইমেইলের মাধ্যমে নির্ধারিত verification
                প্রক্রিয়া অনুসরণ করতে হতে পারে।
              </p>
            </section>

            <section className="bg-red-50 border border-red-100 rounded-xl p-5">
              <h2 className="font-bold text-red-700 mb-2">
                গুরুত্বপূর্ণ
              </h2>

              <p className="text-sm text-gray-700">
                রক্তদাতা হিসেবে নিবন্ধন করা মানেই প্রতিটি পরিস্থিতিতে
                রক্তদান করতে বাধ্য থাকা নয়। রক্তদানের আগে নিজের
                স্বাস্থ্য ও রক্তদানের উপযুক্ততা বিবেচনা করতে হবে।
              </p>
            </section>

            <div className="border-t border-gray-100 pt-6">
              <a
                href="/sheba/blood-bank/register"
                className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition"
              >
                নিবন্ধন ফর্মে ফিরে যান
              </a>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
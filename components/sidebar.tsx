export default function Sidebar() {
  return (
    <div className="space-y-8 bg-white">
      
      {/* ১. জনপ্রিয় সংবাদ সেকশন */}
      <div className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-red-600 rounded-full"></div> {/* স্টাইলিশ সাইড বার */}
          <h3 className="font-bold text-xl text-gray-800">
            জনপ্রিয় সংবাদ
          </h3>
        </div>

        <ul className="space-y-4">
          <li className="group cursor-pointer">
            <a href="#" className="flex items-start gap-3">
              <span className="text-2xl font-bold text-gray-200 group-hover:text-red-600 transition-colors">১</span>
              <p className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors leading-snug">
                চাঁদপুরে নতুন সড়ক উদ্বোধন, যানজট মুক্ত হবে শহর
              </p>
            </a>
          </li>
          
          <li className="group cursor-pointer">
            <a href="#" className="flex items-start gap-3">
              <span className="text-2xl font-bold text-gray-200 group-hover:text-red-600 transition-colors">২</span>
              <p className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors leading-snug">
                নদী ভাঙন রোধে বড় প্রকল্প অনুমোদন পেল একনেকে
              </p>
            </a>
          </li>

          <li className="group cursor-pointer">
            <a href="#" className="flex items-start gap-3">
              <span className="text-2xl font-bold text-gray-200 group-hover:text-red-600 transition-colors">৩</span>
              <p className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors leading-snug">
                স্থানীয় নির্বাচনে নতুন প্রার্থীদের ছড়াছড়ি
              </p>
            </a>
          </li>
        </ul>
      </div>

      {/* ২. বিজ্ঞাপন সেকশন (ঐচ্ছিক) */}
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center text-gray-400 text-sm">
        বিজ্ঞাপনের জন্য এখানে যোগাযোগ করুন
      </div>

      {/* ৩. সর্বশেষ সংবাদ সেকশন */}
      <div className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h3 className="font-bold text-xl text-gray-800">
            সর্বশেষ সংবাদ
          </h3>
        </div>

        <ul className="space-y-5">
          <li className="cursor-pointer group">
            <div className="text-xs text-blue-600 mb-1 font-semibold">চাঁদপুর</div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors leading-snug">
              জেলায় নতুন আধুনিক হাসপাতালের ভিত্তিপ্রস্তর স্থাপন
            </p>
          </li>

          <li className="cursor-pointer group">
            <div className="text-xs text-blue-600 mb-1 font-semibold">শিক্ষা</div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors leading-snug">
              প্রাথমিক বিদ্যালয়ে নতুন প্রযুক্তির ব্যবহার শুরু
            </p>
          </li>

          <li className="cursor-pointer group">
            <div className="text-xs text-blue-600 mb-1 font-semibold">রাজনীতি</div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors leading-snug">
              উপজেলা নির্বাচনে প্রার্থীরা ব্যস্ত সময় পার করছেন
            </p>
          </li>
        </ul>
      </div>

      {/* ৪. ফেসবুক পেজ উইজেট (প্লেসহোল্ডার) */}
      <div className="p-4 bg-blue-50 rounded-lg text-center">
        <p className="text-sm font-bold text-blue-800 mb-2">আমাদের ফেসবুক পেজ</p>
        <button className="bg-[#1877F2] text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors w-full">
          লাইক দিন
        </button>
      </div>

    </div>
  );
}
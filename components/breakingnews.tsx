export default function BreakingNews() {
  return (
    <div className="bg-gray-100 border-y border-gray-200 overflow-hidden">
      <div className="max-w-screen-xl px-4 py-0 mx-auto flex items-center">

        {/* Breaking Label - Fixed Z-index to stay on top */}
        <div
          className="bg-[#116cb4] text-white px-4 py-2 whitespace-nowrap z-10"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          <span className="font-semibold">Breaking</span>
        </div>

        {/* Moving News Container */}
        <div className="flex-1 overflow-hidden relative flex items-center">
          <div className="flex animate-breaking whitespace-nowrap">
            {/* Protiti part-er sheshe gap thaka dorkar */}
            <div className="inline-block px-4">
               চাঁদপুরে নতুন সড়ক উদ্বোধন | Chandpur Road Development Project Started | নদী ভাঙন রোধে নতুন প্রকল্প | Local Election Update | নতুন ব্রিজ নির্মাণ শুরু
            </div>

            {/* Exact Duplicate for smooth loop */}
            <div className="inline-block px-4">
               চাঁদপুরে নতুন সড়ক উদ্বোধন | Chandpur Road Development Project Started | নদী ভাঙন রোধে নতুন প্রকল্প | Local Election Update | নতুন ব্রিজ নির্মাণ শুরু
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
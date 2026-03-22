export default function BreakingNews() {
  return (
    <div className="bg-gray-100 border-y border-gray-200 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 py-0 flex items-center justify-between">

        {/* Breaking Label */}
        <div
          className="bg-red-600 text-white px-4 py-2 whitespace-nowrap"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          <span className="font-semibold">Breaking</span>
        </div>

        {/* Moving News */}
        <div className="flex-1 overflow-hidden">
          <div className="flex animate-breaking whitespace-nowrap">

            <span className="mr-10">
              চাঁদপুরে নতুন সড়ক উদ্বোধন |
              Chandpur Road Development Project Started |
              নদী ভাঙন রোধে নতুন প্রকল্প |
              Local Election Update |
              নতুন ব্রিজ নির্মাণ শুরু
            </span>

            {/* duplicate for smooth loop */}
            <span>
              চাঁদপুরে নতুন সড়ক উদ্বোধন |
              Chandpur Road Development Project Started |
              নদী ভাঙন রোধে নতুন প্রকল্প |
              Local Election Update |
              নতুন ব্রিজ নির্মাণ শুরু
            </span>

          </div>
        </div>

      </div>
    </div>
  );
}
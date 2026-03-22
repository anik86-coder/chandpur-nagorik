export default function BigNewsCard() {
  return (
    <div className="border-t border-gray-300 pt-4">

      <div className="grid grid-cols-2 gap-4">

        <img
          src="https://res.cloudinary.com/dfzirugge/image/upload/v1774084245/3_u1xeqx.png"
          className="w-full h-[150px] object-cover rounded"
        />

        <div>

          <h2 className="font-semibold text-lg hover:text-red-600 transition">
            চাঁদপুরে নদী ভাঙন রোধে নতুন প্রকল্প
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            ২০২৬-০৩-২১
          </p>

        </div>

      </div>

    </div>
  );
}
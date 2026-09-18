import ContactForm from "@/components/contactform";

export default function ContactPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8 font-[Kalpurush]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
          
          <div className="border-b-2 border-red-600 mb-6 pb-2 inline-block">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              যোগাযোগ করুন
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* অফিসের তথ্য */}
            <div className="bg-gray-50 p-6 rounded border border-gray-200">
              <h3 className="text-xl font-bold mb-3 text-[#116cb4]">
                প্রধান কার্যালয়
              </h3>

              <p className="text-gray-700 leading-relaxed">
                চাঁদপুর নাগরিক
              </p>

              <p className="text-gray-700 leading-relaxed">
                চাঁদপুর সদর, চাঁদপুর-৩৬০০।
              </p>

              <div className="mt-4 text-gray-700">
                <p>
                  <strong>ইমেইল:</strong>{" "}
                  info@chandpurnagorik.com
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
import Link from "next/link";

export const metadata = {
  title: "জরুরি সেবা | চাঁদপুর নাগরিক",
  description: "চাঁদপুর জেলার সকল জরুরি সেবার যোগাযোগ নম্বর। পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স।",
};

export default function EmergencyPage() {
  // জাতীয় হেল্পলাইন
  const nationalHelplines = [
    { name: "জাতীয় জরুরি সেবা", number: "999", desc: "পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স", icon: "🚨" },
    { name: "নারী ও শিশু নির্যাতন", number: "109", desc: "নারী ও শিশু নির্যাতন প্রতিরোধে", icon: "🛡️" },
    { name: "সরকারি তথ্য ও সেবা", number: "333", desc: "যেকোনো সরকারি তথ্য জানতে", icon: "ℹ️" },
    { name: "দুদক (দুর্নীতি দমন)", number: "106", desc: "দুর্নীতি প্রতিরোধে অভিযোগ কেন্দ্র", icon: "⚖️" },
  ];

  // পুলিশ স্টেশনের নম্বর (চাঁদপুর)
  const policeContacts = [
    { name: "পুলিশ সুপার (SP), চাঁদপুর", number: "01320-116800" },
    { name: "অতিরিক্ত পুলিশ সুপার (প্রশাসন)", number: "01320-116802" },
    { name: "ওসি, চাঁদপুর সদর মডেল থানা", number: "01320-116839" },
    { name: "ওসি, হাজীগঞ্জ থানা", number: "01320-116867" },
    { name: "ওসি, কচুয়া থানা", number: "01320-116895" },
    { name: "ওসি, ফরিদগঞ্জ থানা", number: "01320-116923" },
    { name: "ওসি, মতলব দক্ষিণ থানা", number: "01320-116951" },
    { name: "ওসি, মতলব উত্তর থানা", number: "01320-116979" },
  ];

  // ফায়ার সার্ভিস
  const fireServices = [
    { name: "চাঁদপুর ফায়ার স্টেশন (উত্তর)", number: "01730-002222" },
    { name: "চাঁদপুর ফায়ার স্টেশন (দক্ষিণ)", number: "01730-002223" },
    { name: "হাজীগঞ্জ ফায়ার স্টেশন", number: "01730-002224" },
    { name: "কচুয়া ফায়ার স্টেশন", number: "01730-002225" },
  ];

  // অ্যাম্বুলেন্স সেবা
  const ambulances = [
    { name: "চাঁদপুর সদর হাসপাতাল অ্যাম্বুলেন্স", number: "01711-000000" }, // ডেমো নম্বর, আসলটা বসাবেন
    { name: "রেড ক্রিসেন্ট সোসাইটি", number: "01811-000000" },
    { name: "আল-আরাফাহ অ্যাম্বুলেন্স সার্ভিস", number: "01911-000000" },
  ];

  return (
    <main className="bg-gray-50 min-h-screen pb-16 font-[Kalpurush]">
      
      {/* ======================================================= */}
      {/* হিরো সেকশন (Emergency Red Theme) */}
      {/* ======================================================= */}
      <section className="bg-red-600 text-white py-12 md:py-16 px-4 relative overflow-hidden">
        {/* ব্যাকগ্রাউন্ড জলছাপ */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <svg className="w-64 h-64 md:w-96 md:h-96" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.5l7.5 13.5h-15L12 6.5z"/></svg>
        </div>

        <div className="max-w-screen-xl mx-auto relative z-10 text-center">
          <Link href="/sheba" className="inline-flex items-center text-red-100 hover:text-white transition-colors mb-6 font-bold text-sm bg-black/20 px-4 py-1.5 rounded-full w-max mx-auto">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            নাগরিক সেবায় ফিরে যান
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            জরুরি যোগাযোগ নম্বর
          </h1>
          <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto leading-relaxed">
            যেকোনো বিপদে বা জরুরি মুহূর্তে দ্রুত সহায়তা পেতে নিচের নম্বরগুলোতে যোগাযোগ করুন। আপনার সচেতনতাই বাঁচাতে পারে একটি জীবন।
          </p>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 -mt-8 relative z-20">
        
        {/* ======================================================= */}
        {/* জাতীয় হেল্পলাইন (Top Priority) */}
        {/* ======================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {nationalHelplines.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md border-b-4 border-red-500 p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
              <span className="text-4xl mb-3">{item.icon}</span>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
              <a 
                href={`tel:${item.number}`} 
                className="mt-auto bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-6 py-2 rounded-full font-bold text-xl tracking-wider transition-colors w-full"
              >
                {item.number}
              </a>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ======================================================= */}
          {/* পুলিশ স্টেশনের নম্বর */}
          {/* ======================================================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-800 text-white px-6 py-4 flex items-center gap-3">
              <span className="text-2xl">🚓</span>
              <h2 className="text-xl font-bold">বাংলাদেশ পুলিশ (চাঁদপুর)</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-3">
                {policeContacts.map((contact, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg hover:border-blue-300 transition-colors gap-3">
                    <span className="font-bold text-gray-800 text-[16px]">{contact.name}</span>
                    <a 
                      href={`tel:${contact.number}`} 
                      className="flex items-center justify-center gap-2 bg-[#116cb4] text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
                      {contact.number}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* ======================================================= */}
            {/* ফায়ার সার্ভিস */}
            {/* ======================================================= */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-orange-600 text-white px-6 py-4 flex items-center gap-3">
                <span className="text-2xl">🚒</span>
                <h2 className="text-xl font-bold">ফায়ার সার্ভিস ও সিভিল ডিফেন্স</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  {fireServices.map((contact, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-lg hover:border-orange-300 transition-colors gap-3">
                      <span className="font-bold text-gray-800 text-[16px]">{contact.name}</span>
                      <a 
                        href={`tel:${contact.number}`} 
                        className="flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-orange-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
                        কল করুন
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ======================================================= */}
            {/* অ্যাম্বুলেন্স সেবা */}
            {/* ======================================================= */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-green-600 text-white px-6 py-4 flex items-center gap-3">
                <span className="text-2xl">🚑</span>
                <h2 className="text-xl font-bold">জরুরি অ্যাম্বুলেন্স সেবা</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  {ambulances.map((contact, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg hover:border-green-300 transition-colors gap-3">
                      <span className="font-bold text-gray-800 text-[16px]">{contact.name}</span>
                      <a 
                        href={`tel:${contact.number}`} 
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-green-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
                        কল করুন
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
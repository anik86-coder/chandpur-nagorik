
import Image from "next/image";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeb5Q-rZpBeklh7lZny_d-W91ISAUYCmulbMeNmKh35Xll9CQ/viewform?usp=header";

export default function OthersPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl">

        {/* Application Information */}
        <section className="mt-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-md sm:p-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                ✓
              </span>
              রক্তদাতা যাচাইকরণ
            </span>

            <h1 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              রক্তদাতা Blue টিকের জন্য আবেদন
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              চাঁদপুর নাগরিক ওয়েবসাইটে আপনার রক্তদাতা প্রোফাইলে
              ব্লু টিক পাওয়ার জন্য নিচের আবেদন ফর্মটি পূরণ করুন।
              আপনার দেওয়া তথ্য যাচাই করে কর্তৃপক্ষ আবেদন পর্যালোচনা করবে।
            </p>

            <div className="mt-6 rounded-xl bg-blue-50 p-4 text-left">
              <h2 className="font-bold text-blue-900">
                আবেদন করার আগে
              </h2>
              <ul className="mt-2 list-inside list-disc space-y-2 text-sm leading-6 text-slate-700">
                <li>আপনার নিবন্ধিত পূর্ণ নাম সঠিকভাবে লিখুন।</li>
                <li>রক্তদাতা আইডি ও ঠিকানা প্রদান করুন।</li>
                <li>যোগাযোগের জন্য সচল মোবাইল নম্বর দিন।</li>
                <li>
                  আবেদন জমা দিলেই ব্লু টিক নিশ্চিত হবে না;
                  যাচাইয়ের পর সিদ্ধান্ত নেওয়া হবে।
                </li>
              </ul>
            </div>

            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-blue-700 active:scale-[0.99] sm:w-auto sm:min-w-72"
            >
              ব্লু টিকের জন্য আবেদন করুন
              <span aria-hidden="true">↗</span>
            </a>

            <p className="mt-3 text-xs text-slate-500">
              বাটনে ক্লিক করলে Google Form নতুন ট্যাবে খুলবে।
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

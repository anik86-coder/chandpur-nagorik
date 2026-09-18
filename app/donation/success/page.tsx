import Link from "next/link";

type SuccessPageProps = {
  searchParams: Promise<{
    invoice_id?: string;
  }>;
};

type PaymentData = {
  full_name?: string;
  email?: string;
  amount?: string | number;
  fee?: string | number;
  charged_amount?: string | number;
  invoice_id?: string;
  payment_method?: string;
  sender_number?: string;
  transaction_id?: string;
  date?: string;
  status?: string;
};

async function verifyPayment(
  invoiceId: string
): Promise<PaymentData | null> {
  const apiKey = process.env.UDDOKTAPAY_API_KEY;

  if (!apiKey) {
    console.error("UDDOKTAPAY_API_KEY is missing.");
    return null;
  }

  try {
    const response = await fetch(
      "https://chandpurnagorik.paymently.io/api/verify-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "RT-UDDOKTAPAY-API-KEY": apiKey,
        },
        body: JSON.stringify({
          invoice_id: invoiceId,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "UddoktaPay verification failed:",
        response.status
      );
      return null;
    }

    const data = await response.json();

    return data?.status
      ? data
      : null;
  } catch (error) {
    console.error("Payment verification error:", error);
    return null;
  }
}

export default async function DonationSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { invoice_id } = await searchParams;

  if (!invoice_id) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-[Kalpurush]">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-lg w-full text-center">
          <div
            className="text-5xl mb-4"
            aria-hidden="true"
          >
            ⚠️
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            পেমেন্ট তথ্য পাওয়া যায়নি
          </h1>

          <p className="text-gray-600 leading-7 mb-6">
            কোনো invoice ID পাওয়া যায়নি।
            <br />
            অনুগ্রহ করে Donation page থেকে আবার চেষ্টা করুন।
          </p>

          <Link
            href="/donation"
            className="inline-flex bg-[#116cb4] hover:bg-[#0d5c9b] text-white px-5 py-3 rounded-xl font-bold transition"
          >
            অনুদান পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const payment = await verifyPayment(invoice_id);

  const status = payment?.status?.toUpperCase();

  const isCompleted = status === "COMPLETED";
  const isPending = status === "PENDING";

  const title = isCompleted
    ? "অনুদান সফল হয়েছে"
    : isPending
      ? "পেমেন্ট যাচাই করা হচ্ছে"
      : "পেমেন্ট সফল হয়নি";

  const message = isCompleted
    ? "আপনার অনুদানের জন্য আন্তরিক ধন্যবাদ। আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে।"
    : isPending
      ? "আপনার পেমেন্ট এখনো সম্পূর্ণ হিসেবে নিশ্চিত হয়নি। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
      : "পেমেন্টটি সফলভাবে সম্পন্ন হয়েছে বলে নিশ্চিত করা যায়নি। প্রয়োজনে আবার চেষ্টা করুন।";

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-[Kalpurush]">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-lg w-full text-center">
        <div
          className="text-5xl mb-4"
          aria-hidden="true"
        >
          {isCompleted
            ? "✅"
            : isPending
              ? "⏳"
              : "❌"}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {title}
        </h1>

        <p className="text-gray-600 leading-7 mb-6">
          {message}
        </p>

        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-6 text-sm">
          {/* Invoice ID */}
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">
              Invoice ID
            </span>

            <span className="font-semibold text-gray-800 break-all text-right">
              {payment?.invoice_id || invoice_id}
            </span>
          </div>

          {/* Amount */}
          {payment?.amount !== undefined && (
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">
                Amount
              </span>

              <span className="font-semibold text-gray-800">
                ৳{payment.amount}
              </span>
            </div>
          )}

          {/* Charged Amount */}
          {payment?.charged_amount !== undefined && (
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">
                Charged Amount
              </span>

              <span className="font-semibold text-gray-800">
                ৳{payment.charged_amount}
              </span>
            </div>
          )}

          {/* Payment Method */}
          {payment?.payment_method && (
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">
                Payment Method
              </span>

              <span className="font-semibold text-gray-800">
                {payment.payment_method}
              </span>
            </div>
          )}

          {/* Transaction ID */}
          {payment?.transaction_id && (
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">
                Transaction ID
              </span>

              <span className="font-semibold text-gray-800 break-all text-right">
                {payment.transaction_id}
              </span>
            </div>
          )}

          {/* Date */}
          {payment?.date && (
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">
                Date
              </span>

              <span className="font-semibold text-gray-800 text-right">
                {payment.date}
              </span>
            </div>
          )}

          {/* Status */}
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">
              Status
            </span>

            <span
              className={`font-bold ${
                isCompleted
                  ? "text-green-600"
                  : isPending
                    ? "text-orange-500"
                    : "text-red-600"
              }`}
            >
              {status || "UNKNOWN"}
            </span>
          </div>
        </div>

        <Link
          href="/donation"
          className="inline-flex bg-[#116cb4] hover:bg-[#0d5c9b] text-white px-5 py-3 rounded-xl font-bold transition"
        >
          অনুদান পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
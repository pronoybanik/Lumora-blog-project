import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentFailed() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f4fb] px-6 py-24">
      <section className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-sm">
        <XCircle className="mx-auto mb-5 text-red-500" size={52} />
        <h1 className="text-3xl font-bold text-slate-900">Payment failed</h1>
        <p className="mt-3 text-slate-600">We couldn’t complete your Premium subscription payment. Please try again.</p>
        <Link to="/pricing" className="mt-7 inline-flex rounded-xl bg-indigo-700 px-5 py-3 font-semibold text-white hover:bg-indigo-800">
          Try again
        </Link>
      </section>
    </main>
  );
}

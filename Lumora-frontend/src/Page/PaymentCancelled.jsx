import { Link } from "react-router-dom";
import { CircleOff } from "lucide-react";

export default function PaymentCancelled() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f4fb] px-6 py-24">
      <section className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-sm">
        <CircleOff className="mx-auto mb-5 text-amber-500" size={52} />
        <h1 className="text-3xl font-bold text-slate-900">Payment cancelled</h1>
        <p className="mt-3 text-slate-600">Your payment was cancelled. No subscription was activated.</p>
        <Link to="/pricing" className="mt-7 inline-flex rounded-xl bg-indigo-700 px-5 py-3 font-semibold text-white hover:bg-indigo-800">
          Return to pricing
        </Link>
      </section>
    </main>
  );
}

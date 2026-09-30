import { Link, useLocation } from "react-router-dom";

export default function PaymentResult() {
  const success = useLocation().pathname === "/payment-success";
  return <main className="min-h-screen bg-[#f4f4fb] px-6 py-24 text-center">
    <h1 className="text-3xl font-bold text-slate-900">{success ? "Premium activated" : "Payment not completed"}</h1>
    <p className="mx-auto mt-3 max-w-md text-slate-600">{success ? "Your account can now open every premium article." : "You can try again whenever you are ready."}</p>
    <Link to={success ? "/blogList" : "/pricing"} className="mt-7 inline-flex rounded-xl bg-indigo-700 px-5 py-3 font-semibold text-white">{success ? "Read premium blogs" : "Return to pricing"}</Link>
  </main>;
}

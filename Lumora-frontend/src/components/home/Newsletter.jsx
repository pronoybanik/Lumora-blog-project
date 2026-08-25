import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  return (
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <div className="bg-indigo-100/70 rounded-3xl px-8 py-14 text-center">
        <h3 className="text-2xl font-bold text-slate-900">Stay Inspired</h3>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          Get the finest stories, ideas, and curated content delivered straight
          to your inbox every week.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-6 max-w-md mx-auto flex items-center gap-2 bg-white rounded-full p-1.5"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-full whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
        <p className="mt-3 text-xs text-slate-400">
          No spam. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;

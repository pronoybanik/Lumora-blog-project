import React from "react";

const Stats = () => {
  const stats = [
    { value: "1M+", label: "ACTIVE READERS" },
    { value: "50k+", label: "PUBLISHED AUTHORS" },
    { value: "200+", label: "CATEGORIES" },
  ];
  return (
    <section className="bg-indigo-50/70">
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 px-6 py-12 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-3xl sm:text-4xl font-bold text-indigo-700">
              {s.value}
            </div>
            <div className="mt-1 text-[11px] tracking-wide text-slate-500 font-medium">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;

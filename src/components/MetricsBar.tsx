const metrics = [
  { num: "5,000+", label: "Retail Outlets Analyzed" },
  { num: "12 hrs", label: "Reporting Time Saved Weekly" },
  { num: "80,000+", label: "Sales Records Validated" },
];

export default function MetricsBar() {
  return (
    <div className="mx-auto mt-5 w-full max-w-[800px] border-y border-[var(--border-light)] px-4 py-4 sm:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-0">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className={`flex flex-col items-center gap-1 text-center ${
              i > 0 ? "sm:border-l sm:border-[var(--border-light)]" : ""
            }`}
          >
            <span className="font-mono-label text-[1.05rem] font-bold text-[var(--primary)] sm:text-[1.1rem]">
              {m.num}
            </span>
            <span className="max-w-[140px] font-mono-label text-[0.6rem] uppercase leading-snug tracking-wider text-[var(--text-muted)] sm:text-[0.65rem]">
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

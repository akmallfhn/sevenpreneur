export default function MarqueeCorporateAITrainingSVP() {
  const items = [
    "Banking & Finance",
    "FMCG",
    "Retail",
    "Manufacturing",
    "Property",
    "Healthcare",
    "Tech & Startup",
    "Professional Services",
  ];
  const doubled = [...items, ...items];

  return (
    <div
      className="py-8 border-t border-b border-[#e8e8e8] overflow-hidden"
      style={{ borderColor: "#e8e8e8" }}
    >
      <p
        className="text-center mb-5 text-[11px] uppercase tracking-[0.16em] text-[#777]"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        Telah dipercaya oleh tim di lintas industri
      </p>
      <div className="flex" style={{ animation: "cat-marquee 40s linear infinite", width: "max-content" }}>
        {doubled.map((item, i) => (
          <div
            key={i}
            className="font-brand flex items-center gap-2.5 mx-8 opacity-70 whitespace-nowrap text-[22px] font-semibold tracking-tight text-[#777]"
            style={{ letterSpacing: "-0.02em" }}
          >
            <span className="w-5 h-5 rounded-md bg-[#777] flex-shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

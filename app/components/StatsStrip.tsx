import { Trade } from "@/lib/types";

function formatMoney(n: number) {
  const sign = n < 0 ? "-" : "";
  return `${sign}₹${Math.abs(n).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

export default function StatsStrip({ trades }: { trades: Trade[] }) {
  const closed = trades.filter((t) => t.status === "CLOSED");
  const netTotal = trades.reduce((sum, t) => sum + t.netPnl, 0);
  const wins = closed.filter((t) => t.netPnl > 0).length;
  const winRate = closed.length ? Math.round((wins / closed.length) * 100) : 0;
  const best = trades.length
    ? Math.max(...trades.map((t) => t.netPnl))
    : 0;
  const worst = trades.length
    ? Math.min(...trades.map((t) => t.netPnl))
    : 0;

  const items = [
    {
      label: "NET P&L",
      value: formatMoney(netTotal),
      tone: netTotal >= 0 ? "gain" : "loss",
    },
    { label: "WIN RATE", value: `${winRate}%`, tone: "neutral" },
    { label: "TRADES", value: `${trades.length}`, tone: "neutral" },
    { label: "BEST", value: formatMoney(best), tone: "gain" },
    { label: "WORST", value: formatMoney(worst), tone: "loss" },
  ];

  return (
    <div className="flex flex-wrap items-stretch border border-border bg-surface rounded-md overflow-hidden">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`flex-1 min-w-[130px] px-5 py-4 ${
            i !== items.length - 1 ? "border-r border-border-soft" : ""
          }`}
        >
          <div className="text-[10px] tracking-[0.14em] text-text-muted font-mono mb-1.5">
            {item.label}
          </div>
          <div
            className={`font-mono font-tabular text-xl sm:text-2xl ${
              item.tone === "gain"
                ? "text-gain"
                : item.tone === "loss"
                ? "text-loss"
                : "text-text"
            }`}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

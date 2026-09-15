import { Trade } from "@/lib/types";

function formatMoney(n: number) {
  const sign = n < 0 ? "-" : "";
  return `${sign}₹${Math.abs(n).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

function getWeekStart(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat
  const diffToMonday = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatRange(start: Date) {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function WeeklyPnl({ trades }: { trades: Trade[] }) {
  const closed = trades.filter((t) => t.status === "CLOSED");

  const weekMap = new Map<string, { start: Date; total: number }>();

  for (const t of closed) {
    const start = getWeekStart(t.date);
    const key = start.toISOString();
    const existing = weekMap.get(key);
    if (existing) {
      existing.total += t.netPnl;
    } else {
      weekMap.set(key, { start, total: t.netPnl });
    }
  }

  const weeks = Array.from(weekMap.values()).sort(
    (a, b) => b.start.getTime() - a.start.getTime()
  );

  const currentWeekStart = getWeekStart(new Date().toISOString()).getTime();

  if (weeks.length === 0) {
    return (
      <div className="border border-border bg-surface rounded-md p-5">
        <p className="text-[10px] tracking-[0.14em] text-text-muted font-mono mb-1">
          WEEKLY P&L
        </p>
        <p className="text-text-muted text-sm mt-2">
          No closed trades yet.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-surface rounded-md p-5">
      <p className="text-[10px] tracking-[0.14em] text-text-muted font-mono mb-3">
        WEEKLY P&L
      </p>
      <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1">
        {weeks.map((w) => {
          const isCurrent = w.start.getTime() === currentWeekStart;
          return (
            <div
              key={w.start.toISOString()}
              className={`flex items-center justify-between py-2 px-2.5 rounded ${
                isCurrent ? "bg-gold-dim border border-gold/30" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-text-muted">
                  {formatRange(w.start)}
                </span>
                {isCurrent && (
                  <span className="text-[9px] font-mono text-gold px-1.5 py-0.5 rounded border border-gold/30">
                    CURRENT
                  </span>
                )}
              </div>
              <span
                className={`font-mono font-tabular text-sm font-medium ${
                  w.total >= 0 ? "text-gain" : "text-loss"
                }`}
              >
                {formatMoney(w.total)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

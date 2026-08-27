"use client";

import { useEffect, useMemo, useState } from "react";
import StatsStrip from "./components/StatsStrip";
import TradeForm from "./components/TradeForm";
import TradeTable from "./components/TradeTable";
import { Trade, TradeType } from "@/lib/types";

type FilterType = "ALL" | TradeType;

export default function Home() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/trades")
      .then((res) => res.json())
      .then((data) => {
        if (data.trades) setTrades(data.trades);
        else setError(data.error || "Could not load trades");
      })
      .catch(() => setError("Could not reach the server"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      filter === "ALL" ? trades : trades.filter((t) => t.tradeType === filter),
    [trades, filter]
  );

  async function handleDelete(id: string) {
    const prev = trades;
    setTrades((t) => t.filter((tr) => tr.id !== id));
    const res = await fetch(`/api/trades/${id}`, { method: "DELETE" });
    if (!res.ok) setTrades(prev);
  }

  const filterOptions: FilterType[] = ["ALL", "FUTURE", "OPTION", "COMMODITY"];

  return (
    <main className="max-w-6xl mx-auto w-full px-5 sm:px-8 py-10 space-y-8">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] tracking-[0.16em] text-gold font-mono mb-1">
            PERSONAL LEDGER
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold text-text">
            Trade Log
          </h1>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-gold text-bg text-sm font-medium px-4 py-2.5 rounded hover:brightness-110 transition"
        >
          {showForm ? "Close form" : "+ Log a trade"}
        </button>
      </header>

      <StatsStrip trades={trades} />

      {showForm && (
        <TradeForm
          onCreated={(trade) => {
            setTrades((t) => [trade, ...t]);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="flex items-center gap-1.5">
        {filterOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`text-xs font-mono px-3 py-1.5 rounded border transition ${
              filter === opt
                ? "border-gold/50 text-gold bg-gold-dim"
                : "border-border text-text-muted hover:text-text"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {error && <p className="text-loss text-sm font-mono">{error}</p>}

      {loading ? (
        <p className="text-text-muted text-sm font-mono">Loading log...</p>
      ) : (
        <TradeTable trades={filtered} onDelete={handleDelete} />
      )}
    </main>
  );
}

"use client";

import { useState } from "react";
import { TRADE_TYPES, DIRECTIONS, TRADE_STATUSES, Trade } from "@/lib/types";

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  tradeName: "",
  tradeType: "FUTURE",
  direction: "LONG",
  entryPrice: "",
  exitPrice: "",
  quantity: "",
  strikePrice: "",
  expiry: "",
  profitLoss: "",
  realizedPnl: "",
  charges: "0",
  strategyTag: "",
  notes: "",
  status: "CLOSED",
};

export default function TradeForm({
  onCreated,
  onCancel,
}: {
  onCreated: (trade: Trade) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOption = form.tradeType === "OPTION";

  function update<K extends keyof typeof emptyForm>(
    key: K,
    value: (typeof emptyForm)[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let screenshotUrl: string | null = null;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
        screenshotUrl = uploadData.url;
      }

      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, screenshotUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save trade");

      onCreated(data.trade);
      setForm(emptyForm);
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full bg-surface-raised border border-border rounded px-3 py-2 text-sm text-text placeholder:text-text-faint focus:outline-none focus:ring-1 focus:ring-gold/60 focus:border-gold/60";
  const labelClass =
    "block text-[10px] tracking-[0.1em] text-text-muted font-mono mb-1.5";

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-border bg-surface rounded-md p-5 space-y-5"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>DATE</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className={labelClass}>TRADE NAME</label>
          <input
            type="text"
            required
            placeholder="e.g. NIFTY 24800 CE"
            value={form.tradeName}
            onChange={(e) => update("tradeName", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>TYPE</label>
          <select
            value={form.tradeType}
            onChange={(e) => update("tradeType", e.target.value)}
            className={inputClass}
          >
            {TRADE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>DIRECTION</label>
          <select
            value={form.direction}
            onChange={(e) => update("direction", e.target.value)}
            className={inputClass}
          >
            {DIRECTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>STATUS</label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className={inputClass}
          >
            {TRADE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>QUANTITY / LOTS</label>
          <input
            type="number"
            step="any"
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>ENTRY PRICE</label>
          <input
            type="number"
            step="any"
            value={form.entryPrice}
            onChange={(e) => update("entryPrice", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>EXIT PRICE</label>
          <input
            type="number"
            step="any"
            value={form.exitPrice}
            onChange={(e) => update("exitPrice", e.target.value)}
            className={inputClass}
          />
        </div>
        {isOption && (
          <>
            <div>
              <label className={labelClass}>STRIKE PRICE</label>
              <input
                type="number"
                step="any"
                value={form.strikePrice}
                onChange={(e) => update("strikePrice", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>EXPIRY</label>
              <input
                type="date"
                value={form.expiry}
                onChange={(e) => update("expiry", e.target.value)}
                className={inputClass}
              />
            </div>
          </>
        )}

        <div>
          <label className={labelClass}>P&L (GROSS)</label>
          <input
            type="number"
            step="any"
            required
            value={form.profitLoss}
            onChange={(e) => update("profitLoss", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>REALIZED PNL</label>
          <input
            type="number"
            step="any"
            required
            value={form.realizedPnl}
            onChange={(e) => update("realizedPnl", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>CHARGES / BROKERAGE</label>
          <input
            type="number"
            step="any"
            value={form.charges}
            onChange={(e) => update("charges", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className={labelClass}>STRATEGY TAG</label>
          <input
            type="text"
            placeholder="e.g. breakout"
            value={form.strategyTag}
            onChange={(e) => update("strategyTag", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>SCREENSHOT</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-border file:bg-surface-raised file:text-text file:text-xs file:cursor-pointer"
          />
        </div>
        <div className="col-span-2 sm:col-span-3">
          <label className={labelClass}>NOTES</label>
          <textarea
            rows={2}
            placeholder="What worked, what didn't..."
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-loss font-mono">{error}</p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="bg-gold text-bg text-sm font-medium px-4 py-2 rounded hover:brightness-110 disabled:opacity-50 transition"
        >
          {submitting ? "Saving..." : "Save trade"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-text-muted text-sm px-4 py-2 hover:text-text transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

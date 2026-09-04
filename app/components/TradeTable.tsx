"use client";

import { useState } from "react";
import { Trade } from "@/lib/types";

function formatMoney(n: number) {
  const sign = n < 0 ? "-" : "";
  return `${sign}₹${Math.abs(n).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const typeStyles: Record<string, string> = {
  FUTURE: "text-gold border-gold/30 bg-gold-dim",
  OPTION: "text-text border-border bg-surface-raised",
  COMMODITY: "text-text-muted border-border bg-surface-raised",
};

export default function TradeTable({ trades }: { trades: Trade[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (trades.length === 0) {
    return (
      <div className="border border-border bg-surface rounded-md p-10 text-center">
        <p className="text-text-muted text-sm">
          No trades logged yet. Add your first entry to start the log.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border border-border bg-surface rounded-md overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-border text-left">
              {[
                "DATE",
                "TRADE",
                "TYPE",
                "DIR",
                "GROSS P&L",
                "REALIZED",
                "NET",
                "TAG",
                "SS",
              ].map((h) => (
                <th
                  key={h}
                  className="font-mono text-[10px] tracking-[0.1em] text-text-muted font-normal px-4 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr
                key={t.id}
                className="border-b border-border-soft last:border-0 hover:bg-surface-raised/60 transition"
              >
                <td className="px-4 py-3 font-mono text-text-muted whitespace-nowrap">
                  {formatDate(t.date)}
                </td>
                <td className="px-4 py-3">
                  <div className="text-text">{t.tradeName}</div>
                  {t.status === "OPEN" && (
                    <span className="text-[10px] text-gold font-mono">
                      OPEN
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${typeStyles[t.tradeType]}`}
                  >
                    {t.tradeType}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-text-muted text-xs">
                  {t.direction === "LONG" ? "LNG" : "SHT"}
                </td>
                <td
                  className={`px-4 py-3 font-mono font-tabular ${
                    t.profitLoss >= 0 ? "text-gain" : "text-loss"
                  }`}
                >
                  {formatMoney(t.profitLoss)}
                </td>
                <td
                  className={`px-4 py-3 font-mono font-tabular ${
                    t.realizedPnl >= 0 ? "text-gain" : "text-loss"
                  }`}
                >
                  {formatMoney(t.realizedPnl)}
                </td>
                <td
                  className={`px-4 py-3 font-mono font-tabular font-medium ${
                    t.netPnl >= 0 ? "text-gain" : "text-loss"
                  }`}
                >
                  {formatMoney(t.netPnl)}
                </td>
                <td className="px-4 py-3 text-text-muted text-xs">
                  {t.strategyTag || "—"}
                </td>
                <td className="px-4 py-3">
                  {t.screenshotUrl ? (
                    <button
                      onClick={() => setLightbox(t.screenshotUrl)}
                      className="block w-10 h-10 rounded overflow-hidden border border-border hover:border-gold/50 transition"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.screenshotUrl}
                        alt={`${t.tradeName} screenshot`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ) : (
                    <span className="text-text-faint text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-bg/90 flex items-center justify-center p-6 z-50"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Trade screenshot"
            className="max-w-full max-h-full rounded border border-border"
          />
        </div>
      )}
    </>
  );
}

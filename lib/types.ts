export type TradeType = "FUTURE" | "OPTION" | "COMMODITY";
export type Direction = "LONG" | "SHORT";
export type TradeStatus = "OPEN" | "CLOSED";

export interface Trade {
  id: string;
  date: string;
  tradeName: string;
  tradeType: TradeType;
  direction: Direction;
  entryPrice: number | null;
  exitPrice: number | null;
  quantity: number | null;
  strikePrice: number | null;
  expiry: string | null;
  profitLoss: number;
  realizedPnl: number;
  charges: number;
  netPnl: number;
  strategyTag: string | null;
  notes: string | null;
  status: TradeStatus;
  screenshotUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export const TRADE_TYPES: TradeType[] = ["FUTURE", "OPTION", "COMMODITY"];
export const DIRECTIONS: Direction[] = ["LONG", "SHORT"];
export const TRADE_STATUSES: TradeStatus[] = ["OPEN", "CLOSED"];

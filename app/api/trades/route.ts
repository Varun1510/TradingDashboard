import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const trades = await prisma.trade.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json({ trades });
  } catch (error) {
    console.error("Failed to fetch trades:", error);
    return NextResponse.json(
      { error: "Could not load trades." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const required = [
      "date",
      "tradeName",
      "tradeType",
      "direction",
      "profitLoss",
      "realizedPnl",
    ];
    for (const field of required) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
      ) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const charges = Number(body.charges ?? 0);
    const realizedPnl = Number(body.realizedPnl);
    const netPnl = realizedPnl - charges;

    const trade = await prisma.trade.create({
      data: {
        date: new Date(body.date),
        tradeName: body.tradeName,
        tradeType: body.tradeType,
        direction: body.direction,
        entryPrice: body.entryPrice !== "" ? Number(body.entryPrice) : null,
        exitPrice: body.exitPrice !== "" ? Number(body.exitPrice) : null,
        quantity: body.quantity !== "" ? Number(body.quantity) : null,
        strikePrice:
          body.strikePrice !== "" && body.strikePrice !== undefined
            ? Number(body.strikePrice)
            : null,
        expiry: body.expiry ? new Date(body.expiry) : null,
        profitLoss: Number(body.profitLoss),
        realizedPnl,
        charges,
        netPnl,
        strategyTag: body.strategyTag || null,
        notes: body.notes || null,
        status: body.status || "CLOSED",
        screenshotUrl: body.screenshotUrl || null,
      },
    });

    return NextResponse.json({ trade }, { status: 201 });
  } catch (error) {
    console.error("Failed to create trade:", error);
    return NextResponse.json(
      { error: "Could not save trade." },
      { status: 500 }
    );
  }
}

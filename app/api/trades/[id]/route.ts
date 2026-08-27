import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data: Record<string, unknown> = {};

    const passthrough = [
      "tradeName",
      "tradeType",
      "direction",
      "strategyTag",
      "notes",
      "status",
      "screenshotUrl",
    ];
    for (const field of passthrough) {
      if (body[field] !== undefined) data[field] = body[field];
    }

    const numeric = [
      "entryPrice",
      "exitPrice",
      "quantity",
      "strikePrice",
      "profitLoss",
      "realizedPnl",
      "charges",
    ];
    for (const field of numeric) {
      if (body[field] !== undefined) {
        data[field] = body[field] === "" ? null : Number(body[field]);
      }
    }

    if (body.date) data.date = new Date(body.date);
    if (body.expiry !== undefined) {
      data.expiry = body.expiry ? new Date(body.expiry) : null;
    }

    if (data.realizedPnl !== undefined || data.charges !== undefined) {
      const existing = await prisma.trade.findUnique({
        where: { id },
      });
      const realizedPnl =
        (data.realizedPnl as number) ?? existing?.realizedPnl ?? 0;
      const charges = (data.charges as number) ?? existing?.charges ?? 0;
      data.netPnl = realizedPnl - charges;
    }

    const trade = await prisma.trade.update({
      where: { id },
      data,
    });

    return NextResponse.json({ trade });
  } catch (error) {
    console.error("Failed to update trade:", error);
    return NextResponse.json(
      { error: "Could not update trade." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.trade.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete trade:", error);
    return NextResponse.json(
      { error: "Could not delete trade." },
      { status: 500 }
    );
  }
}

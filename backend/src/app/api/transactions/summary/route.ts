import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("X-User-Id");
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "all";

    let dateFilter: { gte?: Date } = {};
    const now = new Date();

    if (range === "weekly") {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { gte: weekAgo };
    } else if (range === "monthly") {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { gte: monthAgo };
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: dateFilter,
      },
      orderBy: { date: "asc" },
    });

    // Group transactions by date
    const groupedData = transactions.reduce(
      (
        acc: Record<string, { expenses: number; income: number }>,
        transaction: { date: string | number | Date; amount: number }
      ) => {
        const date = new Date(transaction.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        if (!acc[date]) {
          acc[date] = { expenses: 0, income: 0 };
        }

        if (transaction.amount < 0) {
          acc[date].expenses += Math.abs(transaction.amount);
        } else {
          acc[date].income += transaction.amount;
        }

        return acc;
      },
      {}
    );

    // Format for chart
    const labels = Object.keys(groupedData);
    const expenses = labels.map((date) => groupedData[date].expenses);
    const income = labels.map((date) => groupedData[date].income);

    return NextResponse.json({
      labels,
      datasets: [
        {
          data: expenses,
          color: (opacity = 1) => `rgba(255, 68, 68, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: income,
          color: (opacity = 1) => `rgba(0, 200, 81, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    });
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}

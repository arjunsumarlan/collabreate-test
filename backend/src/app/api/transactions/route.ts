import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('X-User-Id');
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const where: {
      userId: string;
      type?: string;
      name?: {
        contains: string;
        mode: 'insensitive';
      };
    } = {
      userId: userId || '',
      ...(type && type !== 'all' ? { type } : {}),
      ...(search ? {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      } : {})
    };

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('X-User-Id');
    const body = await request.json();
    
    if (!body.name || !body.amount || !body.type || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { name, amount, type, date } = body;

    const transaction = await prisma.transaction.create({
      data: {
        name,
        amount: parseFloat(amount),
        type,
        date: new Date(date),
        userId,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Failed to create transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
} 
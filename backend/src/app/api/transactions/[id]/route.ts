import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const transaction = await prisma.transaction.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
} 
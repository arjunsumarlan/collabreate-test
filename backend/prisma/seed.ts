import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.transaction.deleteMany({});
  await prisma.user.deleteMany({});

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Test User',
    },
  });

  // Seed transactions for the test user
  const transactions = [
    {
      name: 'Grocery Shopping',
      amount: -120.50,
      type: 'expense',
      date: new Date('2024-01-20'),
      userId: user.id,
    },
    {
      name: 'Salary',
      amount: 3000.00,
      type: 'income',
      date: new Date('2024-02-15'),
      userId: user.id,
    },
    {
      name: 'Rent',
      amount: -1500.00,
      type: 'expense',
      date: new Date('2024-02-01'),
      userId: user.id,
    },
    {
      name: 'Freelance Work',
      amount: 500.00,
      type: 'income',
      date: new Date('2024-02-10'),
      userId: user.id,
    },
    {
      name: 'Utilities',
      amount: -200.00,
      type: 'expense',
      date: new Date('2024-02-05'),
      userId: user.id,
    },
  ];

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction,
    });
  }

  console.log('Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
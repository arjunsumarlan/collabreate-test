import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jose from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'secret-key'
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt for:', email);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log('User found:', !!user);

    if (!user || !await bcrypt.compare(password, user.password)) {
      console.log('Invalid credentials');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await new jose.SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    console.log('Login successful for:', email);
    
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Authentication failed:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 
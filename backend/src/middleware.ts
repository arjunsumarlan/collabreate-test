import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'secret-key'
);

export async function middleware(request: NextRequest) {
  // Create a new response instead of modifying the next response
  const response = NextResponse.next();

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Skip auth check for login route and OPTIONS requests
  if (request.nextUrl.pathname === '/api/auth/login' || request.method === 'OPTIONS') {
    return response;
  }

  // Check for auth token
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const token = authHeader.split(' ')[1];
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    
    // Create a new headers object with the existing headers
    const headers = new Headers(request.headers);
    headers.set('X-User-Id', payload.userId as string);

    // Create a new request with the modified headers
    const newRequest = new Request(request.url, {
      method: request.method,
      headers: headers,
      body: request.body,
    });

    // Return a new response with the modified request
    return NextResponse.next({
      request: newRequest,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/:path*']  // This ensures middleware runs on all API routes
}; 
import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db/init';
import {
  verifyPassword,
  generateToken,
  setAuthCookie,
} from '@/lib/auth/utils';
import { User } from '@/types';

function createErrorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), { status });
}

function createAuthResponse(data: any, status: number) {
  return new Response(JSON.stringify(data), { 
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return createErrorResponse('Email and password required', 400);
    }

    // Get database
    const db = getDb();

    // Find user
    const user = db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email) as (User & { password: string }) | undefined;

    if (!user) {
      return createErrorResponse('Invalid email or password', 401);
    }

    // Check if user is enabled
    if (!user.enabled) {
      return createErrorResponse('Account is disabled', 403);
    }

    // Verify password
    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) {
      return createErrorResponse('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set cookie
    await setAuthCookie(token);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return createAuthResponse(
      {
        user: userWithoutPassword,
        token,
        message: 'Login successful',
      },
      200
    );
  } catch (error) {
    console.error('Login error:', error);
    return createErrorResponse('Login failed', 500);
  }
}

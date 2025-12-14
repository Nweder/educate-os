import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db/init';
import { getTokenFromCookies, verifyToken } from '@/lib/auth/utils';
import { User } from '@/types';

function createErrorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), { status });
}

function createResponse(data: any, status: number) {
  return new Response(JSON.stringify(data), { 
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = await getTokenFromCookies();

    if (!token) {
      return createErrorResponse('Not authenticated', 401);
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return createErrorResponse('Invalid or expired token', 401);
    }

    // Get database
    const db = getDb();

    // Fetch user
    const user = db
      .prepare('SELECT id, email, name, role, enabled, openAiKey, createdAt, updatedAt FROM users WHERE id = ?')
      .get(payload.userId) as User | undefined;

    if (!user) {
      return createErrorResponse('User not found', 404);
    }

    return createResponse({ user }, 200);
  } catch (error) {
    console.error('Get current user error:', error);
    return createErrorResponse('Failed to get current user', 500);
  }
}

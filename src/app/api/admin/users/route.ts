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
    // Verify admin
    const token = await getTokenFromCookies();
    if (!token) {
      return createErrorResponse('Not authenticated', 401);
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'Admin') {
      return createErrorResponse('Unauthorized', 403);
    }

    const db = getDb();

    // Get all users
    const users = db
      .prepare('SELECT id, email, name, role, enabled, createdAt, updatedAt FROM users ORDER BY createdAt DESC')
      .all() as User[];

    return createResponse({ users }, 200);
  } catch (error) {
    console.error('Get users error:', error);
    return createErrorResponse('Failed to get users', 500);
  }
}

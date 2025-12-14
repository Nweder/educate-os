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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
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

    const { userId } = await params;
    const db = getDb();

    // Get current user
    const user = db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(userId) as (User & { password: string }) | undefined;

    if (!user) {
      return createErrorResponse('User not found', 404);
    }

    // Prevent disabling self
    if (payload.userId === userId && !user.enabled) {
      return createErrorResponse('Cannot disable your own account', 400);
    }

    // Toggle enabled status
    const newEnabled = user.enabled ? 0 : 1;
    const now = new Date().toISOString();

    db.prepare('UPDATE users SET enabled = ?, updatedAt = ? WHERE id = ?')
      .run(newEnabled, now, userId);

    const updatedUser = db
      .prepare('SELECT id, email, name, role, enabled, createdAt, updatedAt FROM users WHERE id = ?')
      .get(userId) as User;

    return createResponse(
      {
        user: updatedUser,
        message: `User ${updatedUser.enabled ? 'enabled' : 'disabled'} successfully`,
      },
      200
    );
  } catch (error) {
    console.error('Toggle user error:', error);
    return createErrorResponse('Failed to update user', 500);
  }
}

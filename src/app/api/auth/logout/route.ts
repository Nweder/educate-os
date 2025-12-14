import { NextRequest } from 'next/server';
import { clearAuthCookie } from '@/lib/auth/utils';

function createResponse(data: any, status: number) {
  return new Response(JSON.stringify(data), { 
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Clear cookie
    await clearAuthCookie();

    return createResponse(
      { message: 'Logout successful' },
      200
    );
  } catch (error) {
    console.error('Logout error:', error);
    return createResponse({ error: 'Logout failed' }, 500);
  }
}

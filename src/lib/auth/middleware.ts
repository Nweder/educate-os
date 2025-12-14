import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './utils';

export async function withAuth(request: NextRequest, requiredRole?: string) {
  const authHeader = request.headers.get('Authorization');
  const cookieHeader = request.headers.get('Cookie');

  // Get token from Authorization header or cookies
  let token: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (cookieHeader) {
    const match = cookieHeader.match(/authToken=([^;]+)/);
    token = match ? decodeURIComponent(match[1]) : null;
  }

  if (!token) {
    return { error: 'Unauthorized', status: 401 };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return { error: 'Invalid or expired token', status: 401 };
  }

  if (requiredRole && payload.role !== requiredRole) {
    return { error: 'Forbidden', status: 403 };
  }

  return { user: payload, status: 200 };
}

export function createAuthResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function createErrorResponse(error: string, status: number = 400) {
  return NextResponse.json({ error }, { status });
}

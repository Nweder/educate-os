import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db/init';
import { getTokenFromCookies, verifyToken } from '@/lib/auth/utils';

interface Submission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  exerciseId: string;
  exerciseTitle: string;
  language: string;
  status: string;
  submittedAt: string;
  code: string;
}

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
    const url = new URL(request.url);
    const language = url.searchParams.get('language');
    const status = url.searchParams.get('status');

    // Build query
    let query = `
      SELECT 
        cs.id,
        cs.userId,
        u.name AS userName,
        u.email AS userEmail,
        cs.exerciseId,
        e.title AS exerciseTitle,
        cs.language,
        cs.status,
        cs.submittedAt,
        cs.code
      FROM code_submissions cs
      JOIN users u ON cs.userId = u.id
      JOIN exercises e ON cs.exerciseId = e.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (language) {
      query += ' AND cs.language = ?';
      params.push(language);
    }

    if (status) {
      query += ' AND cs.status = ?';
      params.push(status);
    }

    query += ' ORDER BY cs.submittedAt DESC LIMIT 100';

    const submissions = db.prepare(query).all(...params) as Submission[];

    return createResponse({ submissions }, 200);
  } catch (error) {
    console.error('Get submissions error:', error);
    return createErrorResponse('Failed to get submissions', 500);
  }
}

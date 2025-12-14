import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db/init';
import {
  hashPassword,
  validateRegisterInput,
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
    const { name, email, password } = body;

    // Validate input
    const validationError = validateRegisterInput(name, email, password);
    if (validationError) {
      return createErrorResponse(validationError, 400);
    }

    // Get database
    const db = getDb();

    // Check if user exists
    const existingUser = db
      .prepare('SELECT id FROM users WHERE email = ?')
      .get(email);

    if (existingUser) {
      return createErrorResponse('Email already registered', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userId = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, email, name, password, role, enabled, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, email, name, hashedPassword, 'User', 1, now, now);

    // Fetch created user
    const user = db
      .prepare('SELECT id, email, name, role, enabled, createdAt, updatedAt FROM users WHERE id = ?')
      .get(userId) as User;

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set cookie
    await setAuthCookie(token);

    return createAuthResponse(
      {
        user,
        token,
        message: 'Account created successfully',
      },
      201
    );
  } catch (error) {
    console.error('Register error:', error);
    return createErrorResponse('Registration failed', 500);
  }
}

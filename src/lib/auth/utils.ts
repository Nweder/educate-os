import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_EXPIRE = '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Get token from cookies
 */
export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('authToken')?.value || null;
}

/**
 * Get current user from token
 */
export async function getCurrentUser(): Promise<JwtPayload | null> {
  const token = await getTokenFromCookies();
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Validate registration input
 */
export function validateRegisterInput(name: string, email: string, password: string): string | null {
  // Name validation: 3+ chars, no spaces, letters/numbers only
  if (!name || name.length < 3) {
    return 'Name must be at least 3 characters';
  }
  if (name.includes(' ')) {
    return 'Name cannot contain spaces';
  }
  if (!/^[a-zA-Z0-9]+$/.test(name)) {
    return 'Name must contain only letters and numbers';
  }

  // Email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Valid email is required';
  }

  // Password validation: 4+ chars, letters/numbers only
  if (!password || password.length < 4) {
    return 'Password must be at least 4 characters';
  }
  if (!/^[a-zA-Z0-9]+$/.test(password)) {
    return 'Password must contain only letters and numbers';
  }

  return null;
}

/**
 * Set auth token in HTTP-only cookie
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

/**
 * Clear auth cookie
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('authToken');
}

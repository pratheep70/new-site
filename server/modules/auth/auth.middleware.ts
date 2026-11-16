import type { Request, Response, NextFunction } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { adminAuth } from '../../../src/lib/firebase-admin.ts';
import { getOrCreateUser } from '../users/users.service.ts';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  dbUser?: {
    id: number;
    uid: string;
    email: string;
    displayName: string | null;
    role: string;
    isActive: boolean;
  };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token is required.',
    });
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token is empty.',
    });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    const dbUser = await getOrCreateUser(
      decodedToken.uid,
      decodedToken.email || '',
      typeof decodedToken.name === 'string' ? decodedToken.name : null,
    );

    if (!dbUser.isActive) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'This account is inactive.',
      });
    }

    req.dbUser = dbUser;
    return next();
  } catch (error) {
    console.error('Auth verification failed:', error);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired authentication token.',
    });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.dbUser) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication is required.',
    });
  }

  if (req.dbUser.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Forbidden',
      message:
        'Administrator privileges are required to access this resource. Contact the company administrator to authorize your account.',
    });
  }

  return next();
};

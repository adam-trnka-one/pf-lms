import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';

export async function errorLogger(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error to database
  try {
    await prisma.errorLog.create({
      data: {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        timestamp: new Date(),
      },
    });
  } catch (logError) {
    console.error('Failed to log error to database:', logError);
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  next(error);
}
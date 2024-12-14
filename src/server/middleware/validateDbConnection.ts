import { Request, Response, NextFunction } from 'express';
import { healthCheck } from '../utils/dbHelpers';

export async function validateDbConnection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const isHealthy = await healthCheck();
    if (!isHealthy) {
      return res.status(503).json({
        error: 'Database connection is not available'
      });
    }
    next();
  } catch (error) {
    console.error('Database validation failed:', error);
    return res.status(503).json({
      error: 'Database validation failed'
    });
  }
}
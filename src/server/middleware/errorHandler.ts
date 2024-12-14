import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return res.status(409).json({
          message: 'A record with that value already exists'
        });
      case 'P2025':
        return res.status(404).json({
          message: 'Record not found'
        });
      default:
        return res.status(500).json({
          message: 'Database error'
        });
    }
  }

  return res.status(500).json({
    message: 'Internal server error'
  });
};
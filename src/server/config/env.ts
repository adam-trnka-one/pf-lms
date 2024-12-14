import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  JWT_SECRET: z.string().min(32),
});

const envVars = {
  DATABASE_URL: `postgresql://pf_lms_admin:ProductFruitsLMS1@postgresql.r3.websupport.cz:5432/pf_lms?schema=public`,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
};

try {
  envSchema.parse(envVars);
} catch (error) {
  console.error('Environment validation failed:', error);
  process.exit(1);
}

export default envVars;
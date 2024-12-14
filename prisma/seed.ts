import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'adam.trnka@productfruits.com' },
    update: {},
    create: {
      email: 'adam.trnka@productfruits.com',
      firstName: 'Adam',
      lastName: 'Trnka',
      password: hashedPassword,
      status: 'active',
      role: 'admin',
      permissions: {
        canAccessCourses: true,
        canTakeExams: true,
        canDownloadCertificates: true
      }
    }
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
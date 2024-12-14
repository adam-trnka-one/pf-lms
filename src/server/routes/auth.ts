import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept invitation
router.post('/accept-invitation', async (req, res) => {
  try {
    const { email, invitationCode, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email,
        invitationCode,
        status: 'invited'
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid invitation' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        status: 'active',
        invitationCode: null
      }
    });

    res.json({ message: 'Account activated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export const authRouter = router;
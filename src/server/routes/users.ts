import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/authenticate';

const router = Router();
const prisma = new PrismaClient();

// Get all users (admin only)
router.get('/', async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        status: true,
        role: true,
        company: true,
        phone: true,
        title: true,
        avatar: true,
        permissions: true,
        socialMedia: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    // Only allow users to update their own profile or admins to update any profile
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: req.body,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        status: true,
        role: true,
        company: true,
        phone: true,
        title: true,
        avatar: true,
        permissions: true,
        socialMedia: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.post('/:id/change-password', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Only allow users to change their own password or admins to change any password
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If not admin, verify current password
    if (req.user.role !== 'admin') {
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Invite user (admin only)
router.post('/invite', async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const invitationCode = Math.random().toString(36).substring(2, 10);
    const user = await prisma.user.create({
      data: {
        ...req.body,
        status: 'invited',
        invitationCode,
        password: '' // Will be set when user accepts invitation
      }
    });

    res.json({
      message: 'User invited successfully',
      invitationCode
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export const userRouter = router;
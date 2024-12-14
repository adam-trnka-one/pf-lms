import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authenticate';

const router = Router();
const prisma = new PrismaClient();

// Get all courses
router.get('/', async (req: AuthRequest, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        chapters: {
          include: {
            milestones: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        enrollments: {
          where: {
            userId: req.user.id
          },
          select: {
            enrolledAt: true,
            completedAt: true,
            progress: true
          }
        }
      }
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create course
router.post('/', async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const course = await prisma.course.create({
      data: {
        ...req.body,
        chapters: {
          create: req.body.chapters.map((chapter: any, index: number) => ({
            ...chapter,
            order: index,
            milestones: {
              create: chapter.milestones
            }
          }))
        }
      },
      include: {
        instructor: true,
        chapters: {
          include: {
            milestones: true
          }
        }
      }
    });

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.params;
    const course = await prisma.course.update({
      where: { id },
      data: req.body,
      include: {
        instructor: true,
        chapters: {
          include: {
            milestones: true
          }
        }
      }
    });

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll in course
router.post('/:id/enroll', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        userId: req.user.id,
        courseId: id,
        progress: {}
      }
    });

    await prisma.course.update({
      where: { id },
      data: {
        enrolledCount: {
          increment: 1
        }
      }
    });

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete milestone
router.post('/:courseId/chapters/:chapterId/milestones/:milestoneId/complete', 
  async (req: AuthRequest, res) => {
    try {
      const { courseId, chapterId, milestoneId } = req.params;

      const milestone = await prisma.milestone.update({
        where: { id: milestoneId },
        data: {
          completed: true,
          completedAt: new Date()
        }
      });

      // Update enrollment progress
      await prisma.courseEnrollment.update({
        where: {
          userId_courseId: {
            userId: req.user.id,
            courseId
          }
        },
        data: {
          progress: {
            ...req.body.progress
          }
        }
      });

      res.json(milestone);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});

export const courseRouter = router;
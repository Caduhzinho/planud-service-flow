import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  company: z.object({
    name: z.string().min(3),
    cnpj: z.string().min(14),
    email: z.string().email(),
    phone: z.string().min(10),
    address: z.string().min(5)
  })
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign(
      { userId: user.id, companyId: user.companyId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ token, refreshToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, company } = registerSchema.parse(req.body);
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newCompany = await prisma.company.create({
      data: {
        ...company,
        users: {
          create: {
            email,
            password: hashedPassword
          }
        }
      }
    });
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

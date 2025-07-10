import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { company: true }
    });
    
    if (!user) return res.status(401).json({ error: 'User not found' });
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorizeCompany = (req, res, next) => {
  const userCompanyId = req.user.companyId;
  const resourceCompanyId = req.params.companyId || req.body.companyId;
  
  if (userCompanyId !== resourceCompanyId) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }
  
  next();
};

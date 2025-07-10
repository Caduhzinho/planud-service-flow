import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import appointmentRoutes from './routes/appointments.js';
import serviceNoteRoutes from './routes/serviceNotes.js';
import companyRoutes from './routes/company.js';
import preferencesRoutes from './routes/preferences.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100
});
app.use(limiter);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/service-notes', serviceNoteRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

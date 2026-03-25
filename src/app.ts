import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerDefinition } from './config/swagger';

import authRoutes from './features/auth/auth.routes';
import userRoutes from './features/users/user.routes';
import providerRoutes from './features/providers/provider.routes';
import appointmentRoutes from './features/appointments/appointment.routes';
import catalogueRoutes from './features/catalogues/catalogue.routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Global rate limiter: 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

app.use(globalLimiter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

app.use('/auth', authLimiter, authRoutes);
app.use('/user', userRoutes);
app.use('/proveedores', providerRoutes);
app.use('/citas', appointmentRoutes);
app.use('/catalogues', catalogueRoutes);

app.use(errorMiddleware);

export default app;

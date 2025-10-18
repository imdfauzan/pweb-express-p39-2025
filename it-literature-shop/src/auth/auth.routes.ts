// src/auth/auth.routes.ts
import { Router } from 'express';
import {
  registerUserController,
  loginUserController,
  getMeController,
} from './auth.controller';
import validate from '../middleware/validate';
import { registerUserSchema, loginUserSchema } from './auth.validation';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', registerUserController);
router.post('/login', validate(loginUserSchema), loginUserController); // <-- Rute baru

router.get('/me', authenticate, getMeController); // <-- Rute baru yang terproteksi

export default router;
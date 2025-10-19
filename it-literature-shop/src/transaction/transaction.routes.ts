// src/transactions/transaction.routes.ts
import { Router } from 'express';
import { createTransactionController } from './transaction.controller';
import { authenticate } from '../middleware/auth';
import validate from '../middleware/validate';
import { createTransactionSchema } from './transaction.validation';

const router = Router();

// Lindungi semua rute transaksi
router.use(authenticate);

router.post('/', validate(createTransactionSchema), createTransactionController);

export default router;
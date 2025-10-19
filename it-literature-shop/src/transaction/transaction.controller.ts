// src/transactions/transaction.controller.ts
import { Request, Response, NextFunction } from 'express';
import { createTransaction } from './transaction.service';

export const createTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized' });
    }

    const { items } = req.body;
    const result = await createTransaction(userId, items);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: result,
    });
  } catch (error: any) {
    // Tangani error spesifik dari service (stok kurang, buku tidak ada)
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// src/transactions/transaction.service.ts
import prisma from '../utils/prisma';

interface TransactionItem {
  book_id: string;
  quantity: number;
}

export const createTransaction = async (
  userId: string,
  items: TransactionItem[]
) => {
  // prisma.$transaction memastikan semua query di dalamnya berhasil atau semuanya gagal
  const result = await prisma.$transaction(async (tx) => {
    // 1. Ambil semua data buku yang dipesan dalam satu query
    const bookIds = items.map((item) => item.book_id);
    const books = await tx.book.findMany({
      where: {
        id: { in: bookIds },
        deleted_at: null, // Pastikan buku belum dihapus
      },
    });

    // 2. Validasi stok dan keberadaan buku
    let total_price = 0;
    let total_quantity = 0;

    for (const item of items) {
      const book = books.find((b) => b.id === item.book_id);
      if (!book) {
        throw new Error(`Book with id ${item.book_id} not found.`);
      }
      if (book.stock_quantity < item.quantity) {
        throw new Error(`Not enough stock for book: ${book.title}.`);
      }
      total_price += Number(book.price) * item.quantity;
      total_quantity += item.quantity;
    }

    // 3. Buat record Order
    const order = await tx.order.create({
      data: {
        user_id: userId,
      },
    });

    // 4. Buat record OrderItem untuk setiap item
    await tx.orderItem.createMany({
      data: items.map((item) => ({
        order_id: order.id,
        book_id: item.book_id,
        quantity: item.quantity,
      })),
    });

    // 5. Update stok setiap buku (ini bagian paling krusial)
    for (const item of items) {
      await tx.book.update({
        where: { id: item.book_id },
        data: {
          stock_quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    // 6. Kembalikan hasil yang akan digunakan di controller
    return {
      transaction_id: order.id,
      total_quantity,
      total_price,
    };
  });

  return result;
};
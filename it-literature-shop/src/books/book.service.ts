// src/books/book.service.ts
import { Book } from '@prisma/client';
import prisma from '../utils/prisma';

type CreateBookInput = Omit<Book, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

export const createBook = async (input: CreateBookInput) => {
  const book = await prisma.book.create({
    data: input,
  });
  return book;
};

export const getAllBooks = async () => {
  const books = await prisma.book.findMany({
    where: {
      deleted_at: null,
    },
    select: {
      id: true,
      title: true,
      writer: true,
      publisher: true,
      publication_year: true,
      price: true,
      stock_quantity: true,
      genre: {
        select: {
          name: true,
        },
      },
    },
  });
  return books;
};

export const getBookById = async (id: string) => {
  const book = await prisma.book.findFirst({
    where: { id, deleted_at: null },
    select: {
      id: true,
      title: true,
      writer: true,
      publisher: true,
      publication_year: true,
      price: true,
      stock_quantity: true,
      description: true,
      genre: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!book) return null;

  return {
    ...book,
    genre: book.genre.name,
  };
};

interface UpdateBookInput {
  description?: string;
  price?: number;
  stock_quantity?: number;
}

export const updateBook = async (id: string, data: UpdateBookInput) => {
  const book = await prisma.book.update({
    where: { id },
    data,
  });
  return book;
};

export const deleteBook = async (id: string) => {
  await prisma.book.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
};

export const getBooksByGenre = async (genreId: string) => {
  const books = await prisma.book.findMany({
    where: {
      genre_id: genreId,
      deleted_at: null,
    },
    select: {
      id: true,
      title: true,
      writer: true,
      publisher: true,
      publication_year: true,
      price: true,
      stock_quantity: true,
      genre: {
        select: {
          name: true,
        },
      },
    },
  });

  return books.map((book) => ({
    ...book,
    genre: book.genre.name,
  }));
};  // <-- pastikan ada kurung tutup di sini

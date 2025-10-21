// src/books/book.service.ts
import prisma from '../utils/prisma';

type CreateBookInput = {
  title: string;
  writer: string;
  publisher: string;
  publication_year: number;
  description: string;
  price: number;
  stock_quantity: number;
  genre_id: string;
};

export const createBook = async (input: CreateBookInput) => {
  const book = await prisma.books.create({
    data: input,
  });
  return book;
};

export const getAllBooks = async () => {
  const books = await prisma.books.findMany({
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
      genres: {
        select: {
          name: true,
        },
      },
    },
  });
  return books;
};

export const getBookById = async (id: string) => {
  const book = await prisma.books.findFirst({
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
      genres: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!book) return null;

  return {
    ...book,
    genre: book.genres.name,
  };
};

interface UpdateBookInput {
  description?: string;
  price?: number;
  stock_quantity?: number;
}

export const updateBook = async (id: string, data: UpdateBookInput) => {
  const book = await prisma.books.update({
    where: { id },
    data,
  });
  return book;
};

export const deleteBook = async (id: string) => {
  await prisma.books.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
};

export const getBooksByGenre = async (genreId: string) => {
  const books = await prisma.books.findMany({
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
      genres: {
        select: {
          name: true,
        },
      },
    },
  });

  return books.map((book) => ({
    ...book,
    genre: book.genres.name,
  }));
};  // <-- pastikan ada kurung tutup di sini

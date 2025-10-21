// src/genres/genre.service.ts
import prisma from '../utils/prisma';

export const createGenre = async (name: string) => {
  const genre = await prisma.genres.create({
    data: {
      name,
    },
  });
  return genre;
};

// Fungsi untuk mendapatkan semua genre dengan filter
// Kita akan buat sederhana dulu, lalu tambahkan pagination nanti
export const getAllGenres = async () => {
  // Hanya ambil genre yang belum di "soft delete"
  const genres = await prisma.genres.findMany({
    where: {
      deleted_at: null,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc', // Urutkan berdasarkan nama secara default
    },
  });
  return genres;
};

export const getGenreById = async (id: string) => {
  const genre = await prisma.genres.findFirst({
    where: { id, deleted_at: null }, // Pastikan tidak mengambil yang sudah di-soft-delete
    select: { id: true, name: true },
  });
  return genre;
};

export const updateGenre = async (id: string, name: string) => {
  const genre = await prisma.genres.update({
    where: { id },
    data: { name },
  });
  return genre;
};

export const deleteGenre = async (id: string) => {
  // Ini adalah "soft delete", kita hanya mengisi kolom deleted_at
  await prisma.genres.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
};
// src/genres/genre.service.ts
import prisma from '../utils/prisma';

export const createGenre = async (name: string) => {
  const genre = await prisma.genre.create({
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
  const genres = await prisma.genre.findMany({
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
// src/genres/genre.controller.ts
import { Request, Response, NextFunction } from 'express';
import { createGenre, getAllGenres } from './genre.service';

export const createGenreController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const genre = await createGenre(name);

    res.status(201).json({
      success: true,
      message: 'Genre created successfully',
      data: {
        id: genre.id,
        name: genre.name,
        created_at: genre.created_at,
      },
    });
  } catch (error: any) {
    // Tangani error jika nama genre sudah ada
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Genre with that name already exists',
      });
    }
    next(error);
  }
};

export const getAllGenresController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const genres = await getAllGenres();
    res.status(200).json({
      success: true,
      message: 'Get all genre successfully',
      data: genres,
      // Kita akan tambahkan 'meta' untuk pagination nanti
    });
  } catch (error) {
    next(error);
  }
};
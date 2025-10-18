// src/app.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import authRouter from './auth/auth.routes'; // <-- Import router auth
import genreRouter from './genres/genre.routes'; // <-- Import router genre

const app: Express = express();

app.use(express.json());

app.get('/health-check', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy and running!',
    date: new Date().toUTCString(),
  });
});

// Daftarkan router untuk endpoint /auth
app.use('/auth', authRouter); // <-- Gunakan router
app.use('/genre', genreRouter); // <-- Gunakan router genre

// Middleware untuk menangani error global
// Ini akan menangkap error yang dilempar dari controller
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
});

export default app;
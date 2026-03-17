import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';
import categoryRoutes from './routes/categories.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const isProduction = process.env.NODE_ENV === 'production';

app.use(
  cors({
    origin: isProduction ? true : FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

if (isProduction) {
  const staticPath = path.resolve(__dirname, '../../frontend/dist');
  app.use(express.static(staticPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (isProduction) {
    console.log('Serving frontend static files');
  }
});

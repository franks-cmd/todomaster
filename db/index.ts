import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const DATABASE_PATH = process.env.DATABASE_PATH || './data/todo.db';
const absolutePath = path.isAbsolute(DATABASE_PATH)
  ? DATABASE_PATH
  : path.resolve(projectRoot, DATABASE_PATH);

const dir = path.dirname(absolutePath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const client = createClient({ url: `file:${absolutePath}` });

export const db = drizzle(client, { schema });
export { client };

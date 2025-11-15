import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storagePath = path.resolve(__dirname, '../../data/dev.sqlite');

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: process.env.DB_DIALECT || undefined,
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: storagePath,
    logging: false,
  });
}

export default sequelize;

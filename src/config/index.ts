import * as path from 'node:path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(process.cwd(), './.env'),
});

export default {
  port: Number(process.env.PORT) || 4004,
  env: process.env.ENV,
  nodeEnv: process.env.NODE_ENV,
  baseUrl: process.env.BASE_URL || `http://127.0.0.1:4004`,
  frontendUrl: process.env.FRONTEND_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    rsaPubKey: process.env.RSA_PUBLIC_KEY,
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shortlink',
  },
};

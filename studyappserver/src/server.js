import dotenv from 'dotenv';
import app from './app.js';
import { sequelize } from './models/index.js';
import { startBot } from './bot/bot.js';
import https from 'https';
import fs from 'fs';

dotenv.config();

const PORT = process.env.PORT || 3000;
const certName = "historythingserver.ru";
async function bootstrap() {
  try {
    await sequelize.sync();
    https.createServer({ key: fs.readFileSync(`${certName}-key.pem`), cert: fs.readFileSync(`${certName}.pem`) }, app).listen(3001);
    // app.listen(PORT, () => {
    //   console.log(`Server is running on port ${PORT}`);
    // });
    startBot();
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

bootstrap();

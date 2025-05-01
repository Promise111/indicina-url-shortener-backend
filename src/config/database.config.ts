import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config from '.';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: config.nodeEnv !== 'production',
  logging: true,
};

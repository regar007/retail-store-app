import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from './config';

export const AppDataSource = new DataSource({
  host: POSTGRES_HOST,
  port: POSTGRES_PORT as any,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  type: 'postgres',
  synchronize: true,
  logging: false,
  entities: ['src/entities/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  subscribers: ['src/subscribers/**/*{.ts,.js}'],
});
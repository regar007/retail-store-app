import * as dotenv from 'dotenv';

const path = `${__dirname}/../../.env`;

dotenv.config({ path });

export const {
    PORT,
    NODE_ENV,
    DATA_STORE
} = process.env

export const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD
} = process.env

export const {
    REDIS_HOST,
    REDIS_PORT,
} = process.env

export const {
    LOG_LEVEL,
    BUFFER_ASYNC_FLUSH_LENGTH,
} = process.env

export const {
    AUTH_PORT,
    JWT_ACCESS_TOKEN_PRIVATE_KEY,
    JWT_REFRESH_TOKEN_PRIVATE_KEY
} = process.env
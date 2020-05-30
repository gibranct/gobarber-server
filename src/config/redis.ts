const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = (process.env.REDIS_PORT || 6379) as number;

export default {
  host: REDIS_HOST,
  port: REDIS_PORT,
};

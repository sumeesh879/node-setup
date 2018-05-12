import Redis      from 'ioredis';
import logger     from '../logger';

const REDIS_ADDRESS = `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
const DEFAULT_TIMEOUT = 50;
const DEFAULT_TTL = 60;

const redis = new Redis({
  port: process.env.REDIS_PORT, // Redis port
  host: process.env.REDIS_HOST, // Redis host
  family: 4,                    // 4 (IPv4) or 6 (IPv6)
  password: process.env.REDIS_PASSWORD,
  db: 0,
  showFriendlyErrorStack: true,
  enableReadyCheck: true,
  retryStrategy() {
    redis.disconnect(); // Does not attempt reconnection
  }
});

redis.on('ready', () => logger.info(`Connected to Redis@${REDIS_ADDRESS}`));

export default class Cache {
  constructor(redisClient) {
    this.redisClient = redisClient || redis;
  }

  get(key) {
    logger.info({ RedisCache: `HIT - Key: ${key}` });
    return this.redisClient.get(key).timeout(DEFAULT_TIMEOUT);
  }

  set(key, data, ttl, opts = 'EX') {
    return this.redisClient.set(key, data, opts, ttl);
  }

  async getOrSetCache(key, fetchData, ttl = DEFAULT_TTL) {
    try {
      if (this.redisClient.status === 'end') { // on each request, tries to connect to Redis if connection is lost
        this.redisClient.connect().catch((error) => {
          logger.warn({ redisConnection: error.message });
        });
      }
      let data = await this.get(key);
      if (!data) {
        logger.info({ RedisCache: `MISS - Key: ${key}` });
        data = await fetchData();
        if (!data.success) throw new Error(data.payload);
        const setData = (typeof data === 'string') ? data : JSON.stringify(data);
        this.set(key, setData, ttl);
      }
      return (typeof data === 'string') ? JSON.parse(data) : data;
    } catch (error) {
      throw error;
    }
  }

  async customQuery(method = 'get', keys = '') {
    logger.info({ customQuery: { method, keys }});
    try {
      if (method.match(/flush/)) {
        return await this.redisClient[method]();
      }
      const args = keys.split(' ');
      const data = await this.redisClient[method](...args);
      return (typeof data === 'string') ? JSON.parse(data) : data;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

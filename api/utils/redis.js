import Redis from 'ioredis';

let redisClient = null;

if (process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL);
    console.log("Redis Client connected.");
} else {
    // Polyfill (In-Memory Cache) to prevent crashes if REDIS_URL is not yet added to .env
    console.warn("REDIS_URL not found in .env. Using fast in-memory Map fallback for caching.");
    const localCache = new Map();
    redisClient = {
        get: async (key) => localCache.get(key) || null,
        setex: async (key, seconds, value) => {
            localCache.set(key, value);
            setTimeout(() => localCache.delete(key), seconds * 1000);
        },
        del: async (key) => localCache.delete(key)
    };
}

export default redisClient;

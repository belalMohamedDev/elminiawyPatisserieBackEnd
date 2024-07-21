// const { createClient } = require('redis');

// const redisClient = createClient({
//   password: process.env.REDIS_PASSWORD || "",
//   socket: {
//     host: process.env.REDIS_HOST || "127.0.0.1",
//     port: process.env.REDIS_PORT || 6379,
//   },
// });

// redisClient.on('connect', () => {
//   console.log('Connected to Redis');
// });

// redisClient.on('error', (err) => {
//   console.error('Redis connection error:', err);
// });

// // Connect to Redis server
// redisClient.connect();



// module.exports = redisClient;


const { createClient } = require("redis");

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD || "",
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Connect to Redis server
redisClient.connect();

(async () => {
  try {
    // Use the async method for flushing the database
    const success = await redisClient.flushAll();
    console.log("Flush all successful:", success);
  } catch (err) {
    console.error("Error flushing Redis database:", err);
  }
})();

module.exports = redisClient;

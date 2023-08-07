const redis = require('redis');
const UUID = require('uuid');
const { promisify } = require("util");
const client = redis.createClient(process.env.REDIS_URL);

const lrangeAsync = promisify(client.lrange).bind(client);
const getAsync = promisify(client.get).bind(client);
const hmgetAsync = promisify(client.hmget).bind(client);
const incrAsync = promisify(client.incr).bind(client);
const expireAsync = promisify(client.expire).bind(client);

// Rate limiting variables
const MESSAGE_RATE_LIMIT = 15;
const RATE_LIMIT_INTERVAL = 60000; // 1 minute in milliseconds

async function addMessageToDb(messageInfo, username) {
  const userKey = `user:${username}`;
  
  // Check rate limiting for the user
  const currentCount = await getAsync(userKey);
  
  if (currentCount === null) {
    // If no previous message count, initialize and set rate limit
    await incrAsync(userKey);
    await expireAsync(userKey, RATE_LIMIT_INTERVAL / 1000);
  } else if (parseInt(currentCount) < MESSAGE_RATE_LIMIT) {
    // Increment the message count and update the expiry
    await incrAsync(userKey);
    await expireAsync(userKey, RATE_LIMIT_INTERVAL / 1000);
  } else {
    throw new Error('Message rate limit exceeded. Please wait before sending more messages.');
  }

  const messageUuid = UUID.v4();
  client.hmset(messageUuid, messageInfo, redis.print);
  client.lpush('messages', messageUuid);
}

async function getMessageInRange(start = 0, end = 19) {
  const messageUuids = await lrangeAsync('messages', start, end);
  const messages = [];
  
  for (const messageUuid of messageUuids) {
    const object = {};
    object.message = (await hmgetAsync(messageUuid, 'message'))[0];
    object.messageSender = (await hmgetAsync(messageUuid, 'messageSender'))[0];
    messages.push(object);
  }
  
  return messages;
}

module.exports = {
  addMessageToDb,
  getMessageInRange
};

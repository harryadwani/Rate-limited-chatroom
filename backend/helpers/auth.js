const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

function signInUser(username) {
  client.set(username, true, redis.print);
}

module.exports = {
  signInUser
};
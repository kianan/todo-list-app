const { PubSub } = require('@google-cloud/pubsub');
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);

const pubSubClient = new PubSub({
  projectId: process.env.PROJECT_ID,
  credentials: credentials,
});

module.exports = pubSubClient;
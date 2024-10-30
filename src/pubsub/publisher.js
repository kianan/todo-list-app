const pubSubClient = require('./pubsubClient');

async function publishMessage(title, completed, dueDate) {
  const topicName = 'task-scheduler-topic';  // Replace with your topic name
  const data = JSON.stringify({
    title,
    completed,
    dueDate,
  });

  const dataBuffer = Buffer.from(data);

  try {
    const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`[Publisher]: Error publishing message: ${error.message}`);
  }
}

module.exports = { publishMessage };
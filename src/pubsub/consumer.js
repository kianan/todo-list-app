const pubSubClient = require('./pubsubClient');

async function listenForMessages() {
    const subscriptionName = 'task-subscriber'; // Replace with your subscription name
    const subscription = pubSubClient.subscription(subscriptionName);

    // Event listener for incoming messages
    subscription.on('message', message => {
      console.log(`Received message ${message.id}:`);
      console.log(`Data: ${message.data.toString()}`);
      console.log(`Attributes: ${JSON.stringify(message.attributes)}`);

      // Acknowledge that the message has been processed successfully
      message.ack();
    });

    // Event listener for errors
    subscription.on('error', error => {
      console.error(`[Consumer]: Received error: ${error.message}`);
    });
  }

  // Call the function when your server starts
  listenForMessages();

  module.exports = { listenForMessages };
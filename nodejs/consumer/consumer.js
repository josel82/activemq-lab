import { Client } from '@stomp/stompjs';
import WebSocket from 'ws';

const BROKER_URL = 'ws://broker:61614';

const USERNAME = 'labuser';
const PASSWORD = 'labpass';

const QUEUE = '/queue/lab.queue';

const client = new Client({

    brokerURL: BROKER_URL,

    webSocketFactory: () => {
        return new WebSocket(BROKER_URL);
    },

    connectHeaders: {
        login: USERNAME,
        passcode: PASSWORD
    },

    reconnectDelay: 5000,

    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    debug: (message) => {
        // Uncomment to enable STOMP debugging
        // console.log(message);
    }
});

client.onConnect = () => {

    console.log('Connected to ActiveMQ!');
    console.log(`Subscribed to ${QUEUE}`);
    console.log('Waiting for messages...\n');

    client.subscribe(
        QUEUE,
        (message) => {

            console.log('\n--------------------------------');
            console.log('MESSAGE RECEIVED');
            console.log('--------------------------------');
            console.log(`Message: ${message.body}`);
            console.log('--------------------------------\n');

        },
        {
            ack: 'auto'
        }
    );
};

client.onStompError = (frame) => {

    console.error('Broker error:', frame.headers.message);

    if (frame.body) {
        console.error(frame.body);
    }
};

client.onWebSocketClose = () => {
    console.log('Disconnected from ActiveMQ.');
    console.log('Attempting reconnection...');
};

client.onWebSocketError = (error) => {
    console.error('WebSocket error:', error.message);
};

console.log('Starting ActiveMQ Consumer...');
console.log(`Broker: ${BROKER_URL}`);
console.log(`Queue: ${QUEUE}\n`);

client.activate();

// Graceful shutdown
process.on('SIGINT', async () => {

    console.log('\nStopping consumer...');

    await client.deactivate();

    console.log('Consumer disconnected.');

    process.exit(0);
});

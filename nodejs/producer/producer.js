import { Client } from '@stomp/stompjs';
import WebSocket from 'ws';
import readline from 'readline'

const client = new Client({
    brokerURL: 'ws://broker:61614',

    webSocketFactory: () => new WebSocket(
        'ws://broker:61614'
    ),

    connectHeaders: {
        login: 'labuser',
        passcode: 'labpass'
    },

    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

client.onConnect = () => {
    console.log('Connected to ActiveMQ!');
    console.log('Type messages to send.\n');

    askMessage();
};

function askMessage() {
    rl.question('Message > ', (message) => {

        if (message.toLowerCase() === 'exit') {
            rl.close();
            client.deactivate();
            return;
        }

        client.publish({
            destination: '/queue/lab.queue',
            body: message
        });

        console.log('Message sent!\n');

        askMessage();
    });
}

client.onStompError = (frame) => {
    console.error('Broker error:', frame.headers.message);
};

client.activate();
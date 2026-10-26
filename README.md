# ActiveMQ Artemis – Docker & Python Messaging Lab

A simple, hands-on lab for learning how **Apache ActiveMQ Artemis** works.

This project demonstrates basic message-based communication using three Docker containers:

- **ActiveMQ Artemis** – Message broker
- **Python Producer** – Sends messages to the broker
- **Python Consumer** – Receives messages from the broker

The Python applications are deliberately simple and interactive. You interact with them through a Bash shell inside their respective Docker containers.

The goal is to understand the fundamentals of message brokers, queues, producers, consumers and asynchronous messaging without introducing unnecessary complexity.

---

## Architecture

The lab consists of three independent Docker containers connected through a Docker bridge network.

```text
                  Docker Network
                activemq-network
                       
       +-----------------------------+
       |                             |
       |      ActiveMQ Artemis       |
       |          Broker             |
       |                             |
       |       STOMP : 61613         |
       |       Web UI : 8161         |
       |                             |
       +-------------+---------------+
                     |
                     |
              Queue: lab.queue
                     |
             +-------+-------+
             |               |
             v               ^
      +-------------+  +-------------+
      |   Producer  |  |   Consumer  |
      |             |  |             |
      | Python App  |  | Python App  |
      |             |  |             |
      +-------------+  +-------------+
```

**How it works:**

1. The Producer establishes a connection to ActiveMQ.
2. The Producer sends a message to `lab.queue`.
3. ActiveMQ receives and stores the message in the queue.
4. The Consumer subscribes to `lab.queue`.
5. ActiveMQ delivers messages to the Consumer.
6. The Consumer prints the received message to the terminal.

The Producer and Consumer never communicate directly. All messaging takes place through the broker.

---

## Technologies

| Technology | Purpose |
|---|---|
| Docker | Container runtime |
| Docker Compose | Container orchestration |
| Apache ActiveMQ Artemis | Message broker |
| Python 3.12 | Producer and Consumer applications |
| stomp.py | Python STOMP client |
| STOMP 1.2 | Messaging protocol |

### Why STOMP?

STOMP (Simple Text Oriented Messaging Protocol) is a lightweight messaging protocol supported by ActiveMQ Artemis.

It provides a straightforward way for Python applications to communicate with the broker.

This lab uses STOMP rather than the AMQP protocol.

---

## Prerequisites

Before starting, make sure you have:

- Docker installed
- Docker Compose (Docker Compose V2)
- Git installed
- A Bash-compatible terminal

No local Python installation is required. Python and its dependencies are installed inside the Docker containers.

---

## Project Structure

```text
activemq-lab/
│
├── docker-compose.yml
│
├── producer/
│   ├── Dockerfile
│   └── requirements.txt
│
├── consumer/
│   ├── Dockerfile
│   └── requirements.txt
│
└── python/
    ├── producer.py
    └── consumer.py
```

### Components

| File | Description |
|---|---|
| docker-compose.yml | Defines the three Docker services and network |
| producer/Dockerfile | Builds the Producer container |
| producer/requirements.txt | Python dependencies for the Producer |
| consumer/Dockerfile | Builds the Consumer container |
| consumer/requirements.txt | Python dependencies for the Consumer |
| python/producer.py | Interactive Python message producer |
| python/consumer.py | Python message consumer |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/josel82/activemq-lab.git

cd activemq-lab
```

### 2. Start the lab

Build the Python images and start all three containers:

```bash
docker compose up -d --build
```

Docker Compose will:

- Download the ActiveMQ Artemis image.
- Build the Producer image.
- Build the Consumer image.
- Create the Docker network.
- Start the three containers.

### 3. Verify the containers

```bash
docker compose ps
```

You should see three running containers:

| Container | Service |
|---|---|
| activemq-broker | broker |
| activemq-producer | producer |
| activemq-consumer | consumer |

Check the broker logs:

```bash
docker compose logs -f broker
```

Wait for ActiveMQ Artemis to finish starting before running the Python applications.

Press `CTRL+C` to exit the log viewer. The containers will continue running.

---

## ActiveMQ Management Console

ActiveMQ Artemis includes a web-based management console.

Open:

http://localhost:8161

Default lab credentials:

| Setting | Value |
|---|---|
| Username | labuser |
| Password | labpass |

The management console allows you to explore the broker and inspect queues, addresses, connections and message statistics.

---

## Running the Producer and Consumer

Both Python applications are designed to run interactively from Bash.

### 1. Start the Consumer

Open a terminal and execute:

```bash
docker exec -it activemq-consumer bash
```

Inside the container, run:

```bash
python consumer.py
```

Expected output:

```text
Starting consumer...
Connected to ActiveMQ!
Listening on /queue/lab.queue
Heartbeats enabled: 10 seconds
Press CTRL+C to stop.
```

The Consumer is now listening for messages.

Leave this terminal running.

### 2. Start the Producer

Open a second terminal:

```bash
docker exec -it activemq-producer bash
```

Inside the container, run:

```bash
python producer.py
```

Expected output:

```text
Connecting to ActiveMQ...
Connected to ActiveMQ!
Heartbeats enabled: 10 seconds
Type a message and press ENTER to send.
Type 'exit' to quit.

Message >
```

The Producer is now ready to send messages.

### 3. Send your first message

In the Producer terminal, enter:

```text
Hello ActiveMQ!
```

The Producer should display:

```text
Message sent!
```

Switch to the Consumer terminal.

You should see:

```text
--------------------------------
MESSAGE RECEIVED
--------------------------------
Message: Hello ActiveMQ!
--------------------------------
```

Congratulations! You've successfully sent a message through ActiveMQ.

---

## Experiments

The best way to understand a message broker is to experiment with it.

Here are some exercises to try.

### Experiment 1 – Send multiple messages

Send several messages through the Producer:

```text
Message > Message 1
Message > Message 2
Message > Message 3
```

Observe how the Consumer receives them.

**What to learn:**

- How messages are sent to a queue.
- How the broker delivers messages.
- How asynchronous messaging works.

### Experiment 2 – Stop the Consumer

This experiment demonstrates an important characteristic of message brokers: producers and consumers don't need to be online simultaneously.

1. Start the Producer and Consumer.
2. Stop the Consumer using `CTRL+C`.
3. Leave the Producer running.
4. Send several messages.
5. Restart the Consumer:

```bash
docker exec -it activemq-consumer bash

python consumer.py
```

The Consumer should receive the messages that were waiting in the queue.

**What to learn:**

- Message persistence in a queue while a consumer is offline.
- Decoupling producers from consumers.
- Asynchronous communication.

Note: This experiment assumes the broker remains running and the messages have not expired or been removed.

### Experiment 3 – Multiple Consumers

Start a second Consumer in another terminal:

```bash
docker exec -it activemq-consumer bash

python consumer.py
```

You now have two Consumers subscribed to the same queue.

Send several messages from the Producer.

Observe how messages are distributed between the Consumers.

This is known as the **Competing Consumers** pattern.

**What to learn:**

- Multiple consumers can subscribe to the same queue.
- Messages are distributed between consumers.
- Queues can be used to distribute processing workloads.

### Experiment 4 – Stop and restart the broker

1. Stop ActiveMQ:

```bash
docker compose stop broker
```

2. Observe what happens to the Producer and Consumer.
3. Restart ActiveMQ:

```bash
docker compose start broker
```

4. Observe the Python applications.

The current Python examples do not implement automatic reconnection. You may need to restart them after restarting the broker.

**What to learn:**

- What happens when a broker becomes unavailable.
- How clients react to lost connections.
- Why production applications need reconnection and recovery mechanisms.

### Experiment 5 – Explore the queue

Open the ActiveMQ management console:

http://localhost:8161

Explore the queue called:

```text
lab.queue
```

Try stopping the Consumer and sending messages from the Producer.

Observe the message count in the management console.

**What to learn:**

- Queue depth.
- Pending messages.
- Active consumers.
- Broker monitoring.

---

## Connection Configuration

The Python applications use the following connection settings:

| Parameter | Value |
|---|---|
| Broker hostname | broker |
| STOMP port | 61613 |
| Username | labuser |
| Password | labpass |
| Queue destination | /queue/lab.queue |
| STOMP version | 1.2 |
| Heartbeat interval | 10 seconds |

The hostname `broker` is resolved automatically through Docker Compose's internal DNS.

The applications use STOMP heartbeats to help maintain their connections and detect communication failures.

The heartbeat configuration is:

```python
conn = stomp.Connection12(
    [(BROKER_HOST, BROKER_PORT)],
    heartbeats=(10000, 10000)
)
```

The values are expressed in milliseconds.

**Important:** Heartbeats help detect and prevent idle connection timeouts. They do not provide automatic reconnection. That functionality is not yet implemented in this lab.

---

## Useful Docker Commands

| Action | Command |
|---|---|
| Start all containers | `docker compose up -d` |
| Build and start | `docker compose up -d --build` |
| Stop all containers | `docker compose stop` |
| Restart all containers | `docker compose restart` |
| View running containers | `docker compose ps` |
| View broker logs | `docker compose logs -f broker` |
| View all logs | `docker compose logs -f` |
| Open Producer shell | `docker exec -it activemq-producer bash` |
| Open Consumer shell | `docker exec -it activemq-consumer bash` |
| Stop and remove containers | `docker compose down` |

### Completely reset the lab

To remove the containers, network and persistent Docker volumes:

```bash
docker compose down -v
```

This will remove broker data stored in Docker volumes, if any are configured.

---

## Known Limitations

This is an educational lab, not a production-ready messaging platform.

Some limitations are intentional:

- No automatic reconnection in the Python applications.
- No TLS encryption.
- Credentials are hardcoded for simplicity.
- No advanced authentication or authorization.
- No dead-letter queue configuration.
- No custom message retry handling.
- Consumer uses automatic message acknowledgement.
- No application-level message validation or processing.

The objective is to provide a simple environment for understanding ActiveMQ fundamentals.


## Useful Documentation

- [Apache ActiveMQ Artemis](https://activemq.apache.org/components/artemis/)
- [ActiveMQ Artemis Documentation](https://activemq.apache.org/components/artemis/documentation/)
- [ActiveMQ Artemis Docker Image](https://hub.docker.com/r/apache/activemq-artemis)
- [STOMP Protocol](https://stomp.github.io/)
- [Python stomp.py](https://github.com/jasonrbriggs/stomp.py)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

## Purpose of This Project

This repository is intended as a practical learning exercise for anyone interested in understanding message brokers and asynchronous application communication.

The idea is to keep things simple, get the environment running quickly, and learn by experimenting.

**Clone it, start it, send some messages, break things, and see what happens!**

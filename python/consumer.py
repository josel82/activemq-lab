
import time
import stomp

BROKER_HOST = "broker"
BROKER_PORT = 61613

USERNAME = "labuser"
PASSWORD = "labpass"

QUEUE = "/queue/lab.queue"


class MessageListener(stomp.ConnectionListener):

    def on_connected(self, frame):
        print("Connected to ActiveMQ!")

    def on_message(self, frame):
        print("\n--------------------------------")
        print("MESSAGE RECEIVED")
        print("--------------------------------")
        print(f"Message: {frame.body}")
        print("--------------------------------\n")

    def on_error(self, frame):
        print(f"Broker error: {frame.body}")

    def on_disconnected(self):
        print("WARNING: Disconnected from ActiveMQ!")

    def on_heartbeat(self):
        pass

    def on_heartbeat_timeout(self):
        print("WARNING: Heartbeat timeout!")


def main():

    print("Starting consumer...")

    conn = stomp.Connection12(
               [(BROKER_HOST, BROKER_PORT)],
                       heartbeats=(10000, 10000)
                       )

    conn.set_listener("", MessageListener())

    conn.connect(
        USERNAME,
        PASSWORD,
        wait=True
    )

    conn.subscribe(
        destination=QUEUE,
        id=1,
        ack="auto"
    )

    print(f"Listening on {QUEUE}")
    print("Press CTRL+C to stop.\n")

    try:
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nStopping consumer...")

    finally:
        conn.disconnect()


if __name__ == "__main__":
    main()


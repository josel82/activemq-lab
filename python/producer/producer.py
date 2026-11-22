
import stomp

BROKER_HOST = "broker"
BROKER_PORT = 61613

USERNAME = "labuser"
PASSWORD = "labpass"

QUEUE = "/queue/lab.queue"


def main():

    print("Connecting to ActiveMQ...")

    conn = stomp.Connection12(
        [(BROKER_HOST, BROKER_PORT)],
        heartbeats=(10000, 10000)
    )

    conn.connect(
        USERNAME,
        PASSWORD,
        wait=True
    )

    print("Connected to ActiveMQ!")
    print("Heartbeats enabled: 10 seconds")
    print("Type a message and press ENTER to send.")
    print("Type 'exit' to quit.\n")

    try:
        while True:

            message = input("Message > ")

            if message.lower() == "exit":
                break

            conn.send(
                destination=QUEUE,
                body=message
            )

            print("Message sent!\n")

    except KeyboardInterrupt:
        print("\nStopping producer...")

    except stomp.exception.NotConnectedException:
        print("ERROR: Lost connection to ActiveMQ!")

    finally:
        if conn.is_connected():
            conn.disconnect()


if __name__ == "__main__":
    main()


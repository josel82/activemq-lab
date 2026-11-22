FROM python:3.12-slim

WORKDIR /app

COPY python/consumer/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY python/consumer/consumer.py /app/

CMD ["sleep", "infinity"]

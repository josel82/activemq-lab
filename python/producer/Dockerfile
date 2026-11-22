FROM python:3.12-slim

WORKDIR /app

COPY python/producer/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY python/producer/producer.py /app/

CMD ["sleep", "infinity"]


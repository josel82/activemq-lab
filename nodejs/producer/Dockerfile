FROM node:27.0.0-alpha.0.1.1-alpine3.24

WORKDIR /app

COPY nodejs/package*.json ./

RUN npm install

COPY nodejs/producer/producer.js ./

CMD ["sleep", "infinity"]
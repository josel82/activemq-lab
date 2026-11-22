FROM node:27.0.0-alpha.0.1.1-alpine3.24

WORKDIR /app

COPY nodejs/package*.json ./

RUN npm install

COPY nodejs/consumer/consumer.js ./

CMD ["sleep", "infinity"]
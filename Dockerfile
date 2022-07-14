FROM node:16.9.0-alpine

LABEL MAINTAINER "lyz05"
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install

CMD [ "npm","run","start" ]

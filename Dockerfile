FROM node:14-alpine

RUN mkdir /app
WORKDIR /app
COPY . /app
ENTRYPOINT [ "yarn", "start" ]
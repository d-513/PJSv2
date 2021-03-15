FROM node:14-alpine

RUN mkdir /app
WORKDIR /app
COPY . /app
RUN yarn install
ENTRYPOINT [ "yarn", "start" ]
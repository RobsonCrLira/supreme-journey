FROM node:16.15-alpine
WORKDIR /usr/app
RUN  yarn --only=prod
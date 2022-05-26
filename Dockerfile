FROM node:16.15-alpine
WORKDIR /usr/app
COPY ./package.json .
RUN  yarn --only=prod
COPY ./dist ./dist
EXPOSE 3000
CMD yarn start
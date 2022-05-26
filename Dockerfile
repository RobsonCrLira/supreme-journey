FROM node:16.15-alpine
WORKDIR /usr/app
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 3000
CMD npm start
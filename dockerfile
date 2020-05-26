FROM node:12-alpine
WORKDIR /usr/workspace/clean-node-api
COPY ./package.json .
RUN yarn --production
COPY ./dist ./dist
EXPOSE 3333
CMD [ "yarn", "start" ]
FROM node:14.17.3-alpine3.11

ARG BUILD_NUM
ENV CIRCLE_BUILD_NUM=$BUILD_NUM

RUN apk add --no-cache jq bash

RUN echo ${CIRCLE_BUILD_NUM}

RUN mkdir -p /srv/fathers
WORKDIR /srv/fathers

COPY package.json ./
COPY yarn.lock ./
COPY craco.config.js ./
COPY .eslintrc ./
COPY .eslintignore ./
COPY .prettierrc ./
COPY jest.config.js ./
COPY tsconfig.json ./tsconfig.json
COPY tsconfig.server.json ./tsconfig.server.json
COPY src ./src
COPY public ./public
COPY scripts ./scripts
COPY migrations ./migrations
COPY dump ./dump

RUN yarn install
RUN yarn build

CMD yarn start


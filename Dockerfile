FROM node:14.17.3-alpine3.11

ARG BUILD_NUM
ENV CIRCLE_BUILD_NUM=$BUILD_NUM

RUN apk add --no-cache jq

RUN echo ${CIRCLE_BUILD_NUM}

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY tsconfig.server.json ./tsconfig.server.json
COPY public ./public
COPY scripts ./scripts
COPY migrations ./migrations
COPY dump ./dump

RUN yarn build

CMD yarn start


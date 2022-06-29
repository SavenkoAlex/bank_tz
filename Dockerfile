FROM node:gallium

EXPOSE 8181
EXPOSE 9229
WORKDIR /usr/app

COPY package*.json ./
COPY tsconfig.json ./
RUN mkdir src
COPY src /usr/app/src

RUN npm i
RUN npm i -g typescript
RUN tsc -p .

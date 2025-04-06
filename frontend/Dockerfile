
FROM node:20

RUN corepack enable
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --immutable
COPY . .

CMD ["yarn", "dev", "--host"]

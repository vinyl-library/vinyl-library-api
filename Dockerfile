FROM node:alpine AS base

ARG PORT
ARG DATABASE_URL
ENV PORT ${PORT}
ENV DATABASE_URL ${DATABASE_URL}

FROM base AS build

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn prisma generate
RUN yarn build

FROM base AS production

ENV NODE_ENV=production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/yarn.lock .
COPY --from=build /usr/src/app/prisma ./prisma

CMD ["yarn", "start:migrate:prod"]
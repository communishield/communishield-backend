FROM node:20-alpine as build

USER node

COPY --chown=node:node ./app /app
WORKDIR /app

RUN npm ci \
  && npm run build

FROM node:20-alpine

USER node

ENV NODE_ENV=production

COPY --chown=node:node --from=build /app/dist /app/dist
COPY --chown=node:node --from=build /app/package.json /app/package.json
COPY --chown=node:node --from=build /app/package-lock.json /app/package-lock.json
COPY --chown=node:node --from=build /app/assets /app/assets

WORKDIR /app

RUN npm pkg delete scripts.prepare \
  && npm ci --omit=dev

CMD ["node", "dist/index.js"]

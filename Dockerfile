FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src

# The Outlook OAuth callback persists the refresh token to src/.env, so the file must exist and be writable
RUN touch src/.env && chown node:node src/.env

USER node
EXPOSE 3003

CMD ["node", "src/index.mjs"]

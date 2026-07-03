FROM node:26-alpine AS build
WORKDIR /app

ARG SITE_URL
ARG BASE_PATH=/

COPY package.json package-lock.json* ./
RUN npm ci

COPY astro.config.mjs tsconfig.json ./
COPY public ./public
COPY src ./src

RUN SITE_URL="${SITE_URL}" BASE_PATH="${BASE_PATH}" npm run build

FROM caddy:2.11.4-alpine
WORKDIR /srv

ARG VCS_REF=unknown
LABEL org.opencontainers.image.title="The Unreliable Engineer" \
  org.opencontainers.image.source="https://github.com/amineamanzou/TheUnreliableEngineer" \
  org.opencontainers.image.revision="${VCS_REF}"

COPY ops/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 8080

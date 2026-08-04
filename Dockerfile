FROM node:26-alpine@sha256:233761595746769ebfdb6090f44fc7cdf818ae0ce62d2b37e0367723b9823e36 AS build
WORKDIR /app

ARG SITE_URL
ARG BASE_PATH=/
ARG VCS_REF=unknown
ARG PUBLIC_BROWSER_OBSERVABILITY_ENABLED=false
ARG PUBLIC_BROWSER_OBSERVABILITY_URL=
ARG PUBLIC_BROWSER_OBSERVABILITY_API_KEY=
ARG PUBLIC_BROWSER_SERVICE_NAME=the-unreliable-engineer-frontend
ARG PUBLIC_BROWSER_SITE_NAME=theunreliable.engineer
ARG PUBLIC_DEPLOYMENT_ENVIRONMENT=production
ARG PUBLIC_PRODUCT_ANALYTICS_ENABLED=false
ARG PUBLIC_POSTHOG_KEY=
ARG PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
ARG PUBLIC_ANALYTICS_SITE_NAME=theunreliable.engineer

COPY package.json package-lock.json* ./
RUN npm ci && npm audit --omit=dev --audit-level=high

COPY astro.config.mjs tsconfig.json ./
COPY Dockerfile ./Dockerfile
COPY .github/workflows ./.github/workflows
COPY public ./public
COPY scripts ./scripts
COPY src ./src

RUN SITE_URL="${SITE_URL}" \
  BASE_PATH="${BASE_PATH}" \
  PUBLIC_BROWSER_OBSERVABILITY_ENABLED="${PUBLIC_BROWSER_OBSERVABILITY_ENABLED}" \
  PUBLIC_BROWSER_OBSERVABILITY_URL="${PUBLIC_BROWSER_OBSERVABILITY_URL}" \
  PUBLIC_BROWSER_OBSERVABILITY_API_KEY="${PUBLIC_BROWSER_OBSERVABILITY_API_KEY}" \
  PUBLIC_BROWSER_SERVICE_NAME="${PUBLIC_BROWSER_SERVICE_NAME}" \
  PUBLIC_BROWSER_SERVICE_VERSION="${VCS_REF}" \
  PUBLIC_BROWSER_SITE_NAME="${PUBLIC_BROWSER_SITE_NAME}" \
  PUBLIC_DEPLOYMENT_ENVIRONMENT="${PUBLIC_DEPLOYMENT_ENVIRONMENT}" \
  PUBLIC_PRODUCT_ANALYTICS_ENABLED="${PUBLIC_PRODUCT_ANALYTICS_ENABLED}" \
  PUBLIC_POSTHOG_KEY="${PUBLIC_POSTHOG_KEY}" \
  PUBLIC_POSTHOG_HOST="${PUBLIC_POSTHOG_HOST}" \
  PUBLIC_ANALYTICS_SITE_NAME="${PUBLIC_ANALYTICS_SITE_NAME}" \
  PUBLIC_SERVICE_VERSION="${VCS_REF}" \
  npm run build \
  && if [ "${PUBLIC_BROWSER_OBSERVABILITY_ENABLED}" = "true" ]; then \
    npm run check:browser-observability -- --mode=on; \
  else \
    npm run check:browser-observability -- --mode=off; \
  fi \
  && if [ "${PUBLIC_PRODUCT_ANALYTICS_ENABLED}" = "true" ]; then \
    npm run check:product-analytics -- --mode=on; \
  else \
    npm run check:product-analytics -- --mode=off; \
  fi \
  && npm run check:i18n \
  && npm run check:seo \
  && npm run review:static

FROM golang:1.26.5-alpine@sha256:0178a641fbb4858c5f1b48e34bdaabe0350a330a1b1149aabd498d0699ff5fb2 AS caddy-build
WORKDIR /src

RUN apk add --no-cache ca-certificates git
RUN CGO_ENABLED=0 go install -trimpath -ldflags="-s -w -X github.com/caddyserver/caddy/v2.CustomVersion=v2.11.4" github.com/caddyserver/caddy/v2/cmd/caddy@v2.11.4

FROM alpine:3.24@sha256:28bd5fe8b56d1bd048e5babf5b10710ebe0bae67db86916198a6eec434943f8b
WORKDIR /srv

ARG VCS_REF=unknown
LABEL org.opencontainers.image.title="The Unreliable Engineer" \
  org.opencontainers.image.source="https://github.com/amineamanzou/TheUnreliableEngineer" \
  org.opencontainers.image.revision="${VCS_REF}"

RUN apk add --no-cache ca-certificates mailcap tzdata \
  && addgroup -S caddy \
  && adduser -S -D -H -h /srv -s /sbin/nologin -G caddy caddy \
  && mkdir -p /config /data /etc/caddy /srv \
  && chown -R caddy:caddy /config /data /etc/caddy /srv

COPY --from=caddy-build /go/bin/caddy /usr/bin/caddy
COPY ops/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

ENV XDG_CONFIG_HOME=/config \
  XDG_DATA_HOME=/data

USER caddy
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1

ENTRYPOINT ["/usr/bin/caddy"]
CMD ["run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]

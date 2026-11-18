FROM node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS build
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
COPY scripts/checks/dependency-audit.mjs ./scripts/checks/
RUN npm ci && npm run audit:dependencies

COPY astro.config.mjs tsconfig.json ./
COPY Dockerfile ./Dockerfile
COPY .github/workflows ./.github/workflows
COPY public ./public
COPY scripts ./scripts
COPY tests/publication-policy.test.mjs ./tests/publication-policy.test.mjs
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

FROM golang:1.27.4-alpine@sha256:70bd7ddea8b6cbe5d6943cde279d6b67feb10cc924fb9100d1d8757c1575b280 AS caddy-build
WORKDIR /src

RUN apk add --no-cache ca-certificates git
RUN CGO_ENABLED=0 go install -trimpath -ldflags="-s -w -X github.com/caddyserver/caddy/v2.CustomVersion=v2.11.4" github.com/caddyserver/caddy/v2/cmd/caddy@v2.11.4

FROM alpine:3.24@sha256:f59abe656b692d901e184be3445e084786602108599d2a51d229c0f5a48c71bf
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

FROM ghcr.io/alwatr/node:20.10.0 as builder

RUN apk add --no-cache git

RUN set -ex; corepack enable;

COPY . .

RUN set -eux; \
  yarn install --immutable; \
  yarn build; \
  ls -lahF .; \
  ls -RlahF /app/packages/app;

# ---

FROM ghcr.io/alwatr/nginx-ws:2.4.1
LABEL org.opencontainers.image.base.name="ghcr.io/alwatr/nginx-ws:2.2.1"

COPY --from=builder /app/packages/app/dist/ .
# RUN set -eux; ls -RlahF /data;

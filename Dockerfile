# Base stage where we setup pnpm and copy the package files to later install dependencies
FROM node:24.13.0-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./


# Build stage where we install all the dependencies and create the production build
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY tsconfig.base.json ./
COPY turbo.json ./
COPY packages/demo ./packages/demo
COPY packages/react-tei ./packages/react-tei
RUN pnpm turbo run build


# Final stage where we get the production build and run it
FROM nginxinc/nginx-unprivileged:1.29.4-alpine-slim
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/packages/demo/dist /usr/share/nginx/html

# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=20.11.1

################################################################################
# Use node image for base image for all stages.
FROM --platform=linux/amd64 node:${NODE_VERSION}-alpine as base

################################################################################
# Create a stage for installing production dependecies.
FROM base as deps
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

################################################################################
# Create a stage for running the application.
FROM base as runner

WORKDIR /app

ENV NODE_ENV production
ENV HOSTNAME "0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/public ./public
COPY --from=deps /app/.next/standalone ./
COPY --from=deps /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
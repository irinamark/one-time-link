FROM node:18-alpine AS deps

WORKDIR /server

COPY package.json package-lock.json ./

COPY /docs ./docs

RUN npm ci

#Rebuild the source code
FROM node:18-alpine AS builder
WORKDIR /server
COPY --from=deps /server/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run nodejs process
FROM node:18-alpine AS runner
WORKDIR /server
ENV NODE_ENV production

COPY --from=builder /server/package.json ./package.json
COPY --from=builder /server/.sequelizerc.prod ./.sequelizerc
COPY --from=builder /server/dist ./dist
COPY --from=builder /server/node_modules ./node_modules
COPY --from=builder /server/docs ./docs

EXPOSE 4040
ENV PORT 4040

CMD ["npm", "start"]

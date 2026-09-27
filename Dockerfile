FROM node:22-alpine
WORKDIR /app

# Install deps first so Docker caches this layer between code-only changes.
COPY package.json package-lock.json ./
RUN npm ci

# .env (server-only, gitignored) is copied here too — `next build` reads it
# because NEXT_PUBLIC_* values are inlined into the client bundle at build time.
COPY . .
RUN npm run build

ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["npm", "start"]

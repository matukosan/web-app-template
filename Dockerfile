FROM node:lts-alpine

WORKDIR /app

# No build-time environment variables needed
# All environment variables will be provided at runtime

# Copy package files first for better layer caching
COPY package.json ./

# Install dependencies using npm install instead of npm ci
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Generate SvelteKit files and build
RUN npx svelte-kit sync
RUN npm run build

EXPOSE 3000

CMD ["node", "build"]

# Keep NODE_VERSION on the supported Node 24 release line, at least 24.17.0.
ARG NODE_VERSION=24.17.0
FROM node:${NODE_VERSION}-alpine

RUN node -e 'const [major, minor] = process.versions.node.split(".").map(Number); if (major !== 24 || minor < 17) { throw new Error("Indiekit requires Node 24.17.0 or newer within Node 24.x"); }'

# Create app directory
WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production

# Install node modules
COPY package*.json ./

# Can’t use `npm ci` due to https://github.com/npm/cli/issues/4828
RUN npm i --omit=dev --package-lock=false

# Copy application code
COPY . .

# Expose port
EXPOSE 3001

# Start the server by default, this can be overwritten at runtime
CMD [ "npx", "indiekit", "serve" ]

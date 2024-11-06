# Dockerfile
FROM node:18-alpine as base

WORKDIR /

# Development stage
FROM base as development
ENV NODE_ENV=development

COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Command untuk development dengan nodemon
CMD ["npm", "run", "dev"]

# Production stage
FROM base as production
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY . .

CMD ["npm", "start"]
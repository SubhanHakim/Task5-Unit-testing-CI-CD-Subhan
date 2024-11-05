FROM node:18-alpine

WORKDIR /

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript ke JavaScript
RUN npm run build

# Expose port
EXPOSE 3000

# Hanya gunakan satu CMD instruction
CMD ["npm", "start"]
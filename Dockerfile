FROM node:18-alpine as builder


# Set a proper working directory
WORKDIR /app

# Copy package files and install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the project (if using TypeScript)
RUN npm run build


# Fix the CMD syntax with proper comma
CMD ["npm", "run", "start"]
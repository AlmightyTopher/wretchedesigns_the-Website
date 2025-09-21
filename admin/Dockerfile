FROM node:18-alpine

WORKDIR /app

# Install git for deployment functionality
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy the entire project
COPY . .

# Set environment variables for build
ENV NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy-key-for-build

# Build the application with environment validation skipped
RUN SKIP_ENV_VALIDATION=true npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
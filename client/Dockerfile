# --- Stage 1: Build ---
# Use an official Node.js image to build the app
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the source code
COPY . .

# Run the production build
RUN npm run build

# --- Stage 2: Serve ---
# Use a lightweight Nginx image to serve the static files
FROM nginx:1.25-alpine

# Set working directory for Nginx
WORKDIR /usr/share/nginx/html

# Remove the default Nginx welcome page
RUN rm -rf ./*

# Copy the built files from the 'builder' stage
COPY --from=builder /app/dist .

# Expose the default Nginx port
EXPOSE 80

# The default Nginx command will start the server
CMD ["nginx", "-g", "daemon off;"]
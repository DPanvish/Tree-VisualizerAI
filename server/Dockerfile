# Step 1: Use an official Node.js runtime as a parent image
# We use 'alpine' for a small and secure base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
# We copy these first to leverage Docker's build cache.
# If these files don't change, 'npm install' won't run again.
COPY package*.json ./

# Step 4: Install production dependencies
RUN npm install --only=production

# Step 5: Copy the Prisma schema
COPY prisma ./prisma/

# Step 6: Generate the Prisma Client
# This is a critical step for Prisma. It builds the client
# based on your schema for the container's OS.
RUN npx prisma generate

# Step 7: Copy the rest of your application code
COPY . .

# Step 8: Expose the port your app runs on
EXPOSE 5000

# Step 9: Define the command to run your app
# This will execute "node index.js" (from your package.json "start" script)
CMD [ "npm", "start" ]
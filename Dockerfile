# Use the official Node.js 18 Alpine image
FROM node:19-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install production dependencies (add --only=production if you don't need devDependencies)
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Expose port 8080 (the default for Cloud Run)
EXPOSE 8080

# Command to start your application
CMD [ "npm", "start" ]


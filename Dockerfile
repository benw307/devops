FROM node:18-alpine

# Install dependencies
RUN npm install @google-cloud/run googleapis @google-cloud/secret-manager

# Copy application files
COPY package.json .
COPY index.js .

# Expose the port your app will run on
EXPOSE 8080

# Start the application
CMD ["node", "index.js"]

# Stage 1: Install dependencies
FROM node:18-alpine AS build

RUN rm -rf /root/.npm/_cacache
WORKDIR /app

COPY package*.json ./  
RUN npm install

# Stage 2: Build the final image
FROM node:18-alpine
WORKDIR /app

# Clear npm cache here as well
RUN npm cache clean --force
RUN npm install

COPY --from=build /app/node_modules ./node_modules
COPY index.js ./  # Make sure the path is correct

EXPOSE 8080
CMD ["node", "index.js"]

# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# app binds to port 8080 by default in Cloud Run
ENV PORT=8080

# Expose port 8080
EXPOSE 8080

# Define the command to run app
CMD [ "node", "server.js" ]
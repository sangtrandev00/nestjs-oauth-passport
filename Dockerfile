# Use the official Node.js image as a base
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the application port and the new debugging port
EXPOSE 4000
# Change to the new debugging port
EXPOSE 9230 

# Start the application in debug mode
CMD ["node", "--inspect=0.0.0.0:9230", "dist/main.js"]  # Change to the new port
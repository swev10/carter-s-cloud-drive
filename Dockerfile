FROM node:18-alpine

# Set the working directory for the app files
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

COPY server.js ./

# Set working directory for runtime data (uploads/storage)
# This ensures process.cwd() points to this folder, keeping data separate from code.
WORKDIR /app/storage

# Run the server.js file located in the parent directory
CMD ["node", "../server.js"]

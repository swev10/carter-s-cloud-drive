FROM node:18-alpine

# Set the working directory for the app files
WORKDIR /app

# Copy package.json (needed for "type": "module") and server.js
COPY package.json server.js ./

# We do not run npm install because server.js only uses built-in modules.
# If you add external dependencies to server.js later, uncomment the next line:
# RUN npm install

# Set working directory for runtime data (uploads/storage)
# This ensures process.cwd() points to this folder, keeping data separate from code.
WORKDIR /app/storage

# Run the server.js file located in the parent directory
CMD ["node", "../server.js"]

# Use Node.js LTS base image
FROM node:20.18.1

# Set working directory
WORKDIR /usr/src/app

# Set environment variables directly in the Dockerfile
ENV PORT=5000
ENV MONGO_URL=mongodb+srv://dbUser:dbUserPassword@foodapp.jcd6erf.mongodb.net/food-app
ENV JWT_KEY=123
ENV LOG_LEVEL=debug

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all remaining source code
COPY . .
# Expose the app port
EXPOSE 5000

# Start the server
CMD ["npm", "run", "server"]

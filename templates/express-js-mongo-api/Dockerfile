FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project
COPY . .

# Expose the app port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

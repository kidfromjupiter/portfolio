# Use the official Node.js image from the Docker Hub
FROM node:22-bookworm-slim

# setting the build variables properly
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL
# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json into the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the Next.js app code into the container
COPY . /app

# Build the Next.js app
RUN npm run build

# Expose the port Next.js will run on
EXPOSE 3000

# Command to run the Next.js app
CMD ["npm", "start"]


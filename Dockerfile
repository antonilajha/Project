# Use Node.js as the base image
FROM node:18-slim

# Expose port 5002
EXPOSE 5002

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY ./server/package*.json /app/
COPY ./server/swagger*.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY server/src /app/src
COPY DelavnoMesto.html /app/DelavnoMesto.html
COPY Uporabnik.html /app/Uporabnik.html
COPY graf.html /app/graf.html
COPY login.html /app/login.html
COPY regester.html /app/regester.html
COPY protactedPage.html /app/protactedPage.html

# Start the application
CMD ["npm", "start"]
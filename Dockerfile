# Load node server
FROM node:10

# Change working dir to /app
WORKDIR /app

# Add files from current to /app
COPY package*.json ./

# Install node packages
RUN npm install

# Install netcat so wait-for.sh can be used for checking PostgreSQL readiness
# Change the approach to check it so I comment it out
# RUN apt-get update && apt-get install -y netcat

# Copy all other server files
COPY . .

# Run the build
CMD [ "npm", "start" ];

# Expose the port
EXPOSE 4000
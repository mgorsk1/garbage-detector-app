FROM node:13.13-alpine

# Create root directory
WORKDIR /usr/src/app

# Copy sources
COPY client client/
COPY server server/

# Install Lerna
COPY package*.json ./
COPY lerna.json ./
RUN npm install

# Bootstrap packages
RUN npm run bootstrap

# RUN Lerna
EXPOSE 3000
EXPOSE 9000
CMD ["npm", "run", "start"]

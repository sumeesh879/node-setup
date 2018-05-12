FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Takes package.json and package-lock.json
COPY package*.json ./

RUN npm install

# Bundles local app source to work directory
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
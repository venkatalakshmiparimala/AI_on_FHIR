FROM node:20-alpine

WORKDIR /app
COPY . .

# Add curl and git (for node-gyp if needed)
RUN apk add --no-cache curl git

# Install dependencies
RUN npm install

# Build the app
RUN npm run build


EXPOSE 3000

CMD ["npm", "start"]

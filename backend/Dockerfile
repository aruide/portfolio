FROM node:20-alpine

# Outils nécessaires pour compiler better-sqlite3 (module natif)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 1337

CMD ["npm", "run", "develop"]

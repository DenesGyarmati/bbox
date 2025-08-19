FROM node:20-bullseye

WORKDIR /usr/src/app

# Copy only package files first (for caching)
COPY package.json package-lock.json* ./

RUN npm install
COPY . .
EXPOSE 3000

CMD ["npm", "run", "dev"]
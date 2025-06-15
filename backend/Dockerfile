FROM node:18-slim
WORKDIR /app
COPY package.json ./
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/* 
RUN npm install --only=production
COPY . .
RUN chmod +x ./wait-for-it.sh
EXPOSE 3001
CMD ["./wait-for-it.sh", "db", "3306", "--", "node", "server.js"]
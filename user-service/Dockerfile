FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
COPY . .
RUN npx prisma generate
EXPOSE 4002
CMD [ "npm", "start" ]
FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE ${PORT}
CMD [ "npm", "run", "start" ]
# Frontend/Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY ./server/package*.json ./
RUN npm install

COPY ./server/src ./src      

COPY ./server/ ./server     

EXPOSE 5002
CMD ["npm", "start"] 
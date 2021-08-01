FROM node

WORKDIR /home/app
COPY . .

RUN npm i

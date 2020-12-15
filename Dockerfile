FROM node:14.5

WORKDIR /media

COPY package.json ./

RUN npm i

COPY . .

EXPOSE 80
CMD ["nodemon"]

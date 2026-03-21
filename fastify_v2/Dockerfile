# dùng node image
FROM node:22

# tạo thư mục app
WORKDIR /app

# copy package
COPY package*.json ./

# install dependencies
RUN npm install

# copy source code
COPY . .

# port fastify
EXPOSE 3000

# start server
CMD ["node", "src/app.js"]
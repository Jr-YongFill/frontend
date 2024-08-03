FROM node:20 AS builder

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json

RUN npm install --force

COPY . /usr/src/app

RUN npm run build

FROM nginx:latest

RUN rm -rf /etc/nginx/conf.d

COPY conf /etc/nginx

COPY --from=builder /usr/src/app/build  /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

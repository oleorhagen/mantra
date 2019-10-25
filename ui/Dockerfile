FROM node:12 AS builder
WORKDIR /work
COPY package.json ./
RUN npm install
COPY webpack.config.js index.html ./
COPY app ./app
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /work/dist /usr/share/nginx/html
COPY favicon.ico /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chown nginx:nginx -R /usr/share/nginx/html

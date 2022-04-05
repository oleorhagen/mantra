FROM node:16.14-alpine AS builder
WORKDIR /work
COPY package.json package-lock.json webpack.config.js index.html favicon.ico ./
RUN npm ci
COPY app ./app
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /work/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chown nginx:nginx -R /usr/share/nginx/html

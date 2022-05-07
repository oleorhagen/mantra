FROM node:18-alpine AS builder
WORKDIR /work
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /work/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chown nginx:nginx -R /usr/share/nginx/html

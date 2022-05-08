FROM node:18-alpine AS builder
WORKDIR /work
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG GITLAB_TOKEN
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /work/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chown nginx:nginx -R /usr/share/nginx/html

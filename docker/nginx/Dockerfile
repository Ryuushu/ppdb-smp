# ========================
# 1. FRONTEND BUILD (NODE)
# ========================
FROM node:20-alpine AS frontend

WORKDIR /laravel

COPY ./package*.json ./
RUN npm ci

COPY .
RUN npm run build


# ========================
# 2. NGINX RUNTIME
# ========================
FROM nginx:alpine

COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=frontend /app/public /var/www/public

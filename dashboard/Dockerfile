FROM nginx:1.27-alpine

# Sajikan dashboard statis + proxy Docker API via unix socket.
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /usr/share/nginx/html/index.html
COPY app.js /usr/share/nginx/html/app.js

EXPOSE 80

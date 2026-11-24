FROM caddy:2-alpine

COPY deploy/railway/Caddyfile /etc/caddy/Caddyfile
COPY app/ /srv/app/
COPY data/ /srv/data/

EXPOSE 8080

from caddy:latest

copy Caddyfile /etc/caddy/Caddyfile
copy dist /srv

expose 80

cmd ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]

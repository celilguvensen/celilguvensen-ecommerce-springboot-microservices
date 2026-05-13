FROM openresty/openresty:alpine

RUN apk add --no-cache \
    lua5.1 \
    lua5.1-dev \
    lua5.1-socket \
    lua5.1-sec \
    lua5.1-filesystem \
    luarocks5.1 \
    curl \
    build-base \
 && ln -s /usr/bin/luarocks-5.1 /usr/bin/luarocks5.1 \
 && ln -s /usr/bin/luarocks-5.1 /usr/bin/luarocks \
 && luarocks install lua-resty-jwt \
 && luarocks install lua-resty-http

RUN mkdir -p /usr/local/openresty/nginx/logs

WORKDIR /usr/local/openresty/nginx

CMD ["openresty", "-g", "daemon off;"]

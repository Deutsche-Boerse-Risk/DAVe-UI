#!/bin/bash
set -e

# if command starts with an option, prepend the start script
if [ "${1:0:1}" = '-' ]; then
  set -- nginx "$@"
fi

configFile="/etc/nginx/nginx.conf"

read -d '' FALLBACK_CONFIG << EOF || true
        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files \$uri \$uri/ /index.html;
        }
EOF

read -d '' ERROR_CONFIG << EOF || true
        # redirect server error pages to the static page /index.html
        error_page   500 502 503 504 =200 /index.html;
EOF

read -d '' HTTP_CONFIG << EOF || true
    server {
        listen       80;
        server_name  localhost;

        ${FALLBACK_CONFIG}

        ${ERROR_CONFIG}
    }
EOF

if [ "$1" == "nginx" ]; then
  if [ "$DAVE_REST_URL" ]; then
    echo "window.baseRestURL = '${DAVE_REST_URL}/api/v1.0';" > /usr/share/nginx/html/restUrl.js
  fi

  #####
  # HTTP
  #####

  # Compression
  if [ "$DAVE_HTTP_COMPRESSION" ]; then
    cat >> ${configFile} <<EOF
    # Use GZIP compression whenever possible
    gzip  on;
    gzip_types      text/plain application/xml text/css application/javascript;
    gzip_proxied    no-cache no-store private expired auth;
    gzip_min_length 0;
    gunzip on;

EOF
  else
    cat >> ${configFile} <<EOF
    # Dont use GZIP compression whenever possible
    gzip off;

EOF
  fi

  # SSL
  if [[ "$DAVE_HTTP_SSL_SERVER_PUBLIC_KEY" && "$DAVE_HTTP_SSL_SERVER_PRIVATE_KEY" ]]; then
    certDir="/etc/nginx/cert"
    mkdir ${certDir}

    echo "$DAVE_HTTP_SSL_SERVER_PUBLIC_KEY" > ${certDir}/nginx.crt
    echo "$DAVE_HTTP_SSL_SERVER_PRIVATE_KEY" > ${certDir}/nginx.pem

    # Set default port if not provided
    if [ -z "$DAVE_HTTPS_REDIRECT_PORT" ]; then
        DAVE_HTTPS_REDIRECT_PORT=443
    fi

    # Append HTTP->HTTPS redirect, certificates and ssl config.
    cat >> ${configFile} <<EOF
    server {
        listen 80;
        server_name localhost;
        return 301 https://\$host:${DAVE_HTTPS_REDIRECT_PORT}\$request_uri;
    }

    server {
        listen              443 ssl;
        server_name         localhost;
        ssl_certificate     ${certDir}/nginx.crt;
        ssl_certificate_key ${certDir}/nginx.pem;

        ssl_session_cache shared:SSL:20m;
        ssl_session_timeout 60m;

        ssl_prefer_server_ciphers on;

        ssl_ciphers ECDH+AESGCM:ECDH+AES256:ECDH+AES128:DH+3DES:!ADH:!AECDH:!MD5;

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

        add_header Strict-Transport-Security "max-age=31536000" always;

EOF

    if [ "$DAVE_HTTP_SSL_TRUSTED_CA" ]; then
      echo "$DAVE_HTTP_SSL_TRUSTED_CA" > ${certDir}/trusted.ca

      cat ${certDir}/nginx.crt ${certDir}/trusted.ca > ${certDir}/trustchain.crt

      cat >> ${configFile} <<EOF
        ssl_stapling on;
        ssl_stapling_verify on;
        ssl_trusted_certificate ${certDir}/trustchain.crt;
        resolver 8.8.8.8 8.8.4.4;

EOF

    fi

    # Append the rest
    cat >> ${configFile} <<EOF
        ${FALLBACK_CONFIG}

        ${ERROR_CONFIG}
    }
}
EOF

  else
    #HTTP config only
    cat >> ${configFile} <<EOF
    ${HTTP_CONFIG}
}
EOF

  fi
else
  # Default configuration to run HTTP server only
  cat >> ${configFile} <<EOF
    ${HTTP_CONFIG}
}
EOF

fi

cat ${configFile}
echo "$@"

exec "$@"

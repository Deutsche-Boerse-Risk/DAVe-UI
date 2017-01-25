FROM nginx

# Copy static content
COPY ./dist /usr/share/nginx/html

# Add nginx.conf file to configure the HTTP server
COPY ./nginx.conf /etc/nginx/nginx.conf

# Add entrypoint
COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["-g", "daemon off;"]

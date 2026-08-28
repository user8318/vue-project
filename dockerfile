FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/vue-project*
COPY dist/ /usr/share/nginx/html/vue-project
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
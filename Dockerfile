FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY site/peptideoshealth.com.br/ /usr/share/nginx/html/
EXPOSE 80

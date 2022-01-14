FROM node:14.18.3-alpine3.15 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
COPY ./yarn.lock /app/
RUN yarn --silent
COPY . /app
RUN yarn build

FROM nginx:1.21.5-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
WORKDIR /usr/share/nginx/html/
EXPOSE 80
CMD ["/bin/sh", "-c", "/usr/share/nginx/html/setenv.sh && nginx -g 'daemon off;'"]
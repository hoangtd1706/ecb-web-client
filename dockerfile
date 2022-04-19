FROM node:alpine as ui-builder

WORKDIR /home/ui

COPY . .

RUN npm install

ARG REACT_APP_HOST_IP_ADDRESS

ENV REACT_APP_HOST_IP_ADDRESS $REACT_APP_HOST_IP_ADDRESS

RUN npm run build

FROM nginx
COPY --from=ui-builder /home/ui/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

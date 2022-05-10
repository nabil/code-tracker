FROM node:16.13.1-alpine as code-tracker-build
WORKDIR /app
COPY package.json ./
COPY package-lock.lock ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:1.21.6-alpine
COPY --from=code-tracker-build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
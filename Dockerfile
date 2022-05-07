FROM node:18.1.0-alpine as code-tracker-build
WORKDIR /app
COPY package.json ./
COPY package-lock.lock ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:1.20.2-alpine
COPY --from=code-tracker-build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
FROM node:24.13.0-alpine
ENV NODE_ENV=production
WORKDIR /opt/app
COPY . .
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]

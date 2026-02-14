from node:22-alpine as base

workdir /app
copy dist/ ./dist/
copy package.json ./

expose 3001

cmd ["node", "dist/main.mjs"]

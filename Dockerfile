FROM node:22.14.0

ENV HOST='0.0.0.0'
ENV PORT='3000'

WORKDIR /app

COPY . .

# RUN npm install --legacy-peer-deps
# RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
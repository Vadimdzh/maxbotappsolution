FROM node:20-bullseye

WORKDIR /app

COPY studyappserver/package*.json ./studyappserver/
RUN cd studyappserver && npm install

COPY studyappserver ./studyappserver

WORKDIR /app/studyappserver

EXPOSE 3001

CMD ["npm", "run", "start"]

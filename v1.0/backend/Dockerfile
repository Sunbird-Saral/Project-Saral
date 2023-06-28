FROM node:16.10
LABEL maintainer="dileep.gadiraju@tarento.com"

ENV PROFILE=dev
ENV PORT=3000
ENV MONGODB_URL=mongodb://10.0.0.185:27017/saraldata_dev
ENV JWT_SECRET=SARALDATA_NODE
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run test

RUN echo JWT_SECRET=$JWT_SECRET

RUN chmod +x ./entrypoint.sh

RUN mkdir ./config && touch ./config/$PROFILE.env \
    && echo PORT=$PORT >> ./config/$PROFILE.env  \
    && echo MONGODB_URL=$MONGODB_URL >> ./config/$PROFILE.env \
    && echo JWT_SECRET=$JWT_SECRET >> ./config/$PROFILE.env \
    && chmod 777 ./config/$PROFILE.env

EXPOSE $PORT

CMD ["/bin/bash","-c","./entrypoint.sh $PROFILE $PORT $MONGODB_URL $JWT_SECRET"]

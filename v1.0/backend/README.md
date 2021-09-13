# Saral Reference Backend Packaging #

* docker build . -t saral-backend:1.0-latest


* docker run --name saral-backend -p 3000:3000 -it saral-backend:1.0-latest
* docker run --env PROFILE=uat --env PORT=3005 --env MONGODB_URL=mongodb://docker.for.mac.localhost:27017/saralnew --env JWT_SECRET=UP_SARALDATA_NODE --name saral-backend -p 3005:3005 -it saral-backend:1.0-latest


# Saral Reference Backend Packaging #

* docker build . -t saral-backend:1.0-latest --build-arg PORT=3001
* docker build . -t saral-backend:1.0-prod1 --build-arg MONGODB_URL=mongodb://<hostname>:27017/saralprod --build-arg PROFILE=PROD


* docker run -it saral-backend:1.0-latest dev1  --build-arg PROFILE=dev1
* docker run -it saral-backend:1.0-latest prod  --build-arg PROFILE=prod



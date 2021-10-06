# Saral Backend APIs Build #

* docker build . -t saral-backend:1.0-latest

# Saral Backend APIs docker deployment #

* Stop and remove existing containers with name saral-backend.
>> `docker stop saral-backend`
>> `docker rm saral-backend`

* Spwan saral-backend.

>> `docker run --name saral-backend -p 3000:3000 -it saral-backend:1.0-latest`
>> `docker run --env PROFILE=uat --env PORT=3005 --env MONGODB_URL=mongodb://localhost:27017/saralnew --env JWT_SECRET=SARALDATA_NODE --name saral-backend -p 3005:3005 -it saral-backend:1.0-latest`



* For Mac Machine use docker.for.mac.localhost to refer to host machine from container. Also use -p "0.0.0.0:3005:3005" so that container be reached from host machine using localhost.

>> `docker run --env PROFILE=uat --env PORT=3005 --env MONGODB_URL=mongodb://docker.for.mac.localhost:27017/saralnew --env JWT_SECRET=SARALDATA_NODE --name saral-backend -p "0.0.0.0:3005:3005" -it saral-backend:1.0-latest`

>> `docker run --env PROFILE=uat -d --env PORT=3005 --env MONGODB_URL=mongodb://docker.for.mac.localhost:27017/saralnew --env JWT_SECRET=SARALDATA_NODE --name saral-backend -p "0.0.0.0:3005:3005" -it saral-backend:1.0-latest`

# Saral Backend APIs docker compose deployment , tear down #

* Change Director to ./backend folder where docker-compose.yml
* Make a directory(eg. /usr/local/mongodb/data/saralv1db) for saral database on host machine and update docker-compose.yml volume mount if directory is different.
* Execute below command to bring up saral-mongodb and saral-backend
>> `docker-compose up --detach`
* To bringdown the app , execute below command
>> `docker-compose down`

# Saral Backend APIs docker Swarm deployment,scale, tear down #

>> `docker stack deploy -c saralbackend-stack.yml saral-backend`

>> `docker service list`

>> `docker service scale saral-backend_saral-backend=3`

>> `docker stack rm saral-backend`

# Golden data import #

* Make sure golden data json files are in ./data folder.
* If you are running backend as docker container , use below commands to import golden data placed in ./data folder.

>> `docker exec -it saral-backend bash`

* Below commands to be executed with in saral-backend container to load golden data.

>> `node ./data/import-data.js --delete`
>> `node ./data/import-data.js --import`
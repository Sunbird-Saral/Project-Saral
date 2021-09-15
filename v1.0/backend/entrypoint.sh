#!/bin/bash
echo "PROFILE : $1 "
echo "PORT : $2 "
echo "MONGODB_URL : $3 "
echo "JWT_SECRET : $4 "

touch ./config/$1.env
echo ./config/$1.env
echo PORT=$2 > ./config/$1.env
echo MONGODB_URL=$3 >> ./config/$1.env
echo JWT_SECRET=$4 >> ./config/$1.env

chmod 777 ./config/$1.env
cat ./config/$1.env

npm run $1
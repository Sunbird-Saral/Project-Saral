#! /bin/bash

cd v1.0/backend
if [ -f "$(pwd)/build" ]
then
sudo rm -rf $(pwd)/build
fi
if [  $( docker ps -q -f status=exited --filter "name=$JOB_BASE_NAME" ) ]
then
docker rm "$JOB_BASE_NAME"
fi
commit_id=${BUILD_ID}-$(git rev-parse --short HEAD)
echo $commit_id> commit_id.txt
cp ../../specs/v1.5/swagger-saral-maintenance.yaml ./src
cp ../../specs/v1.5/swagger-saral-frontend.yaml ./src
cp ../../specs/v1.5/swagger-saral-apidoc.yaml ./src
                                          

docker build -t saaral123/$image_name:$image_tag .
docker login -u saaral123 -p Saral@123
docker push saaral123/$image_name:$image_tag

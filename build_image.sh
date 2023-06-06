#!/bin/bash

cd v1.0/backend

if [ -f "$(pwd)/build" ]; then
    sudo rm -rf $(pwd)/build
fi

if [ $(docker ps -q -f status=exited --filter "name=$JOB_BASE_NAME") ]; then
    docker rm "$JOB_BASE_NAME"
fi

commit_id=${BUILD_ID}-$(git rev-parse --short HEAD)
echo $commit_id > commit_id.txt

cp ../../specs/v1.5/swagger-saral-maintenance.yaml ./src
cp ../../specs/v1.5/swagger-saral-frontend.yaml ./src
cp ../../specs/v1.5/swagger-saral-apidoc.yaml ./src

image_name="backendapi"
image_tag="2.0"

# Generate a dynamic tag based on the build number
image_tag="${image_tag}-$BUILD_NUMBER"

# Build and tag the Docker image
docker build -t "$image_name:$image_tag" .

# Push the Docker image to a registry if needed
docker push "$image_name:$image_tag"

# Export the IMAGE_TAG environment variable
export IMAGE_TAG="$image_tag"

                                          

docker build -t saaral123/$image_name:$image_tag .
docker login -u saaral123 -p Saral@123
docker push saaral123/$image_name:$image_tag

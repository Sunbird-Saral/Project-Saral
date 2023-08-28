#!/bin/bash

# Generate the dynamic image tag
image_tag="2.0-$BUILD_NUMBER"

# Replace the placeholder with the image tag in the deployment file
sed -i "s/{{IMAGE_TAG}}/$image_tag/g" saral_backend_EKS.yml

# Apply the modified deployment file to Kubernetes
kubectl apply -f saral_backend_EKS.yml -n test

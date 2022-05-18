#!/bin/bash
rm -rf ./vialand-be
git clone https://github.com/blackparadise0407/vialand-be.git
cp .env ./vialand-be/.env
cd ./vialand-be
docker-compose up -d --build

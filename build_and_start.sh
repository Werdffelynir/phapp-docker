#!/usr/bin/env bash

docker build -t phapp:1.0.0 .
docker run -d -p 81:80 --name phapp_c1 phapp:1.0.0
firefox 127.0.0.1:81
